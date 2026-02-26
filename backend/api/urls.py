from django.urls import path
from .views import (
    FoodPostListView,
    FoodPostCreateView,
    FoodPostDetailView,
    MyFoodPostsView,
    FoodPostDeleteView,

    CreateFoodRequestView,
    MyFoodRequestsView,
    IncomingFoodRequestsView,
    AcceptFoodRequestView,
    DeclineFoodRequestView,
    CompleteFoodRequestView,
    CancelFoodRequestView,   # ✅ NEW
)

urlpatterns = [
    # Food Posts
    path('posts/', FoodPostListView.as_view()),
    path('posts/create/', FoodPostCreateView.as_view()),
    path('posts/<int:pk>/', FoodPostDetailView.as_view()),
    path('posts/my-posts/', MyFoodPostsView.as_view()),
    path('posts/<int:pk>/delete/', FoodPostDeleteView.as_view()),

    # Food Requests
    path('requests/create/', CreateFoodRequestView.as_view()),
    path('requests/my/', MyFoodRequestsView.as_view()),
    path('requests/incoming/', IncomingFoodRequestsView.as_view()),
    path('requests/<int:pk>/accept/', AcceptFoodRequestView.as_view()),
    path('requests/<int:pk>/decline/', DeclineFoodRequestView.as_view()),
    path('requests/<int:pk>/complete/', CompleteFoodRequestView.as_view()),
    path('requests/<int:pk>/cancel/', CancelFoodRequestView.as_view()),  # ✅ NEW
]