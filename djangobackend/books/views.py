from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Review, Book, Author
from .serializers import ReviewSerializer, BookSerializer, AuthorSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    """
    VueSet pour gérer toutes les opérations CRUD sur les avis.
    """
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
class BookViewSet(viewsets.ModelViewSet):
    """
    VueSet pour gérer toutes les opérations CRUD sur les livres.
    """
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class AuthorViewSet(viewsets.ModelViewSet):
    """
    VueSet pour gérer toutes les opérations CRUD sur les auteurs.
    """
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

