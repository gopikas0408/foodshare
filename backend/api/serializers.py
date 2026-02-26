from rest_framework import serializers
from .models import FoodPost, FoodImage
from authentication.serializers import UserSerializer
from .models import FoodRequest

class FoodImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodImage
        fields = ['id', 'image', 'is_primary']


class FoodPostSerializer(serializers.ModelSerializer):
    donor = UserSerializer(read_only=True)
    images = FoodImageSerializer(many=True, read_only=True)

    class Meta:
        model = FoodPost
        fields = [
            'id',
            'donor',
            'title',
            'description',
            'category',
            'quantity',
            'pickup_location',
            'available_until',
            'status',
            'views',
            'request_count',
            'images',
            'created_at',
        ]


class FoodPostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodPost
        fields = [
            'title',
            'description',
            'category',
            'quantity',
            'pickup_location',
            'available_until',
        ]
        
class FoodRequestSerializer(serializers.ModelSerializer):
    requester = UserSerializer(read_only=True)

    class Meta:
        model = FoodRequest
        fields = [
            'id',
            'post',
            'requester',
            'message',
            'status',
            'pickup_time',
            'created_at'
        ]