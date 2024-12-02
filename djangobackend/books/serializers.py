# books/serializers.py
from rest_framework import serializers
from .models import Book, Author, Review

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id','title', 'author', 'description', 'cover_image', 'created_at', 'updated_at']

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id','name', 'bio', 'profile_pic', 'created_at', 'updated_at']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'book', 'user', 'review', 'rating', 'reading_status', 'created_at', 'updated_at']
