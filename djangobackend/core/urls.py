from django.urls import path, include  # Add 'include' here
from core.views import CreateUserView, UserDetailView, AuthorListCreateView, AuthorDetailView, BookListCreateView, BookDetailView, UserBooksListView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter  # Import the router for API views

# Initialize the router for any viewsets you want to add
router = DefaultRouter()
# Add your viewsets here, e.g., router.register('book', BookViewSet)

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
    # User's Book Detail (update)
path('user-books/<int:pk>/', UserBookDetailView.as_view(), name='user-book-detail'),

    # User's Books (new route)
    path('user/books/', UserBooksListView.as_view(), name='user-books-list'),  # Add the new route for user books


    # JWT Authentication Endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Include the router URLs
    path('api/v1/', include(router.urls)),  # Include all API routes from the router
]
