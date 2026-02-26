from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404

from .models import FoodPost, FoodImage, FoodRequest
from .serializers import (
    FoodPostSerializer,
    FoodPostCreateSerializer,
    FoodRequestSerializer
)
from notifications.utils import create_notification


# ===============================
# FOOD POSTS
# ===============================

class FoodPostListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        posts = FoodPost.objects.filter(status='available').order_by('-created_at')
        serializer = FoodPostSerializer(posts, many=True)
        return Response(serializer.data)


class FoodPostCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = FoodPostCreateSerializer(data=request.data)
        if serializer.is_valid():
            post = serializer.save(donor=request.user)

            images = request.FILES.getlist('images')
            for i, image in enumerate(images):
                FoodImage.objects.create(
                    post=post,
                    image=image,
                    is_primary=True if i == 0 else False
                )

            return Response(
                FoodPostSerializer(post).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FoodPostDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        post = get_object_or_404(FoodPost, pk=pk)
        post.views += 1
        post.save()
        serializer = FoodPostSerializer(post)
        return Response(serializer.data)


class MyFoodPostsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        posts = FoodPost.objects.filter(donor=request.user).order_by('-created_at')
        serializer = FoodPostSerializer(posts, many=True)
        return Response(serializer.data)


class FoodPostDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        post = get_object_or_404(FoodPost, pk=pk, donor=request.user)
        post.delete()
        return Response({"message": "Post deleted"})


# ===============================
# FOOD REQUESTS
# ===============================

class CreateFoodRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        post_id = request.data.get('post_id')
        message = request.data.get('message', '')

        post = get_object_or_404(FoodPost, id=post_id)

        if post.donor == request.user:
            return Response(
                {"error": "You cannot request your own food"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if post.status != 'available':
            return Response(
                {"error": "Food is not available"},
                status=status.HTTP_400_BAD_REQUEST
            )

        food_request, created = FoodRequest.objects.get_or_create(
            post=post,
            requester=request.user,
            defaults={'message': message}
        )

        if not created:
            return Response(
                {"error": "You already requested this food"},
                status=status.HTTP_400_BAD_REQUEST
            )

        post.request_count += 1
        post.save()

        create_notification(
            user=post.donor,
            type='new_request',
            title='New Food Request',
            message=f'{request.user.name} requested your food: {post.title}',
            related_id=post.id
        )

        return Response(
            FoodRequestSerializer(food_request).data,
            status=status.HTTP_201_CREATED
        )


class MyFoodRequestsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        requests = FoodRequest.objects.filter(
            requester=request.user
        ).order_by('-created_at')

        serializer = FoodRequestSerializer(requests, many=True)
        return Response(serializer.data)


class IncomingFoodRequestsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        requests = FoodRequest.objects.filter(
            post__donor=request.user
        ).order_by('-created_at')

        serializer = FoodRequestSerializer(requests, many=True)
        return Response(serializer.data)


class AcceptFoodRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        food_request = get_object_or_404(
            FoodRequest,
            id=pk,
            post__donor=request.user
        )

        food_request.status = 'accepted'
        food_request.save()

        food_request.post.status = 'assigned'
        food_request.post.save()

        create_notification(
            user=food_request.requester,
            type='request_accepted',
            title='Request Accepted',
            message=f'Your request for {food_request.post.title} was accepted',
            related_id=food_request.post.id
        )

        return Response({"message": "Request accepted"})


class DeclineFoodRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        food_request = get_object_or_404(
            FoodRequest,
            id=pk,
            post__donor=request.user
        )

        food_request.status = 'declined'
        food_request.save()

        create_notification(
            user=food_request.requester,
            type='request_declined',
            title='Request Declined',
            message=f'Your request for {food_request.post.title} was declined',
            related_id=food_request.post.id
        )

        return Response({"message": "Request declined"})


class CompleteFoodRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        food_request = get_object_or_404(
            FoodRequest,
            id=pk,
            post__donor=request.user,
            status='accepted'
        )

        food_request.status = 'completed'
        food_request.save()

        food_request.post.status = 'completed'
        food_request.post.save()

        create_notification(
            user=food_request.requester,
            type='post_completed',
            title='Food Pickup Completed',
            message=f'Pickup completed for {food_request.post.title}',
            related_id=food_request.post.id
        )

        return Response({"message": "Donation completed"})


# ===============================
# CANCEL FOOD REQUEST (NEW)
# ===============================

class CancelFoodRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        food_request = get_object_or_404(
            FoodRequest,
            id=pk,
            requester=request.user
        )

        if food_request.status not in ['pending', 'accepted']:
            return Response(
                {"error": "This request cannot be cancelled"},
                status=status.HTTP_400_BAD_REQUEST
            )

        food_request.status = 'cancelled'
        food_request.save()

        # Reassign post back to available
        post = food_request.post
        post.status = 'available'
        post.save()

        create_notification(
            user=post.donor,
            type='request_cancelled',
            title='Food Request Cancelled',
            message=f'{request.user.name} cancelled the request for {post.title}',
            related_id=food_request.id
        )

        return Response(
            {"message": "Request cancelled successfully"},
            status=status.HTTP_200_OK
        )