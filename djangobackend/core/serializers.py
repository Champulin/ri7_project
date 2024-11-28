# core/serializers.py
from rest_framework import serializers
from .models import UserBook
from books.models import Book
from users.models import NewUser
from books.models import Author

# User Serializer (for the user model)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'about', 'profile_pic', 'created_at', 'updated_at']

# Author Serializer (for the author model)
class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'bio', 'profile_pic', 'created_at', 'updated_at']

# Book Serializer (for the book model)
class BookSerializer(serializers.ModelSerializer):
    author = AuthorSerializer()  # Nested Author serializer

    class Meta:
        model = Book
        fields = ['id', 'title', 'description', 'cover_image', 'rating', 'author', 'created_at', 'updated_at']

# UserBook Serializer
class UserBookSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested User serializer
    book = BookSerializer()  # Nested Book serializer (which includes Author data)

    class Meta:
        model = UserBook
        fields = ['id', 'book', 'user', 'review', 'rating', 'reading_status', 'created_at', 'updated_at']
