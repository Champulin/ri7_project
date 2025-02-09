# mybookreader/urls.py

from django.contrib import admin  # Make sure this import is included
from django.urls import path, include
from django.conf.urls.static import static
from . import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Admin route
    path('admin/', admin.site.urls),  # Make sure admin is correctly imported

    # Include the API routes for 'core' (which might be related to books, etc.)
    path('api/v1/', include('core.urls')),  # This should remain as it was to handle core routes
    path('api/v1/', include('books.urls')),
        # JWT Authentication routes (Fixes 404 issue)
    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Include user-related API routes
    path('api/v1/users/', include('users.urls')),  # Prefix changed to 'api/v1/users/'
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
