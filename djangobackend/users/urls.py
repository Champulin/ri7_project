# users/urls.py
from django.urls import path
from .views import UserProfileView, UserUpdateView, UserCreateView

urlpatterns = [
    # URL for fetching user profile by user_id
    path('profile/<int:user_id>/', UserProfileView.as_view(), name='user-profile'),
    
    # URL for updating user data
    path('profile/update/<int:user_id>/', UserUpdateView.as_view(), name='user-update'),
    
    # URL for creating a new user
    path('profile/create/', UserCreateView.as_view(), name='user-create'),
]
