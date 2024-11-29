from django.urls import path
from core.views import CreateUserView, UserDetailView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # JWT Authentication Endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Token endpoint
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh token endpoint

    # User endpoints
    path('signup/', CreateUserView.as_view(), name='signup'),
    path('user/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

]
