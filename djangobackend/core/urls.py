from django.urls import path
from core.views import CreateUserView , UserDetailView, AuthorListCreateView, AuthorDetailView, BookListCreateView, BookDetailView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns = [
    # User endpoints
    path('signup/', CreateUserView.as_view(), name='signup'),
    path('user/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    # Author endpoints
    path('authors/', AuthorListCreateView.as_view(), name='author-list-create'),
    path('authors/<int:pk>/', AuthorDetailView.as_view(), name='author-detail'),

    # Book endpoints
    path('books/', BookListCreateView.as_view(), name='book-list-create'),
    path('books/<int:pk>/', BookDetailView.as_view(), name='book-detail'),
    # JWT Authentication Endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
