# mybookreader/urls.py

from django.contrib import admin  # Make sure this import is included
from django.urls import path, include
from django.conf.urls.static import static
from . import settings

urlpatterns = [
    # Admin route
    path('admin/', admin.site.urls),  # Make sure admin is correctly imported

    # Include the API routes for 'core' (which might be related to books, etc.)
    path('api/v1/', include('core.urls')),  # This should remain as it was to handle core routes
    path('api/v1/', include('books.urls')),
    
    # Include user-related API routes
    path('api/v1/users/', include('users.urls')),  # Prefix changed to 'api/v1/users/'
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
