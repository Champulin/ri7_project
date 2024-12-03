# books/serializers.py
from rest_framework import serializers
from .models import Book, Author, Review
from django.db.models import Avg

class BookSerializer(serializers.ModelSerializer):
    rating = serializers.SerializerMethodField()  # Add custom field for rating

    class Meta:
        model = Book
        fields = ['id', 'title', 'rating', 'author', 'description', 'cover_image', 'created_at', 'updated_at']

    def get_rating(self, obj):
        """Calculate the average rating for the book."""
        average_rating = obj.review_set.aggregate(Avg('rating'))['rating__avg']  # Assumes related_name='review_set'
        return round(average_rating, 2) if average_rating is not None else 0
class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id','name', 'bio', 'profile_pic', 'created_at', 'updated_at']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'book', 'user', 'review', 'rating', 'reading_status', 'created_at', 'updated_at']
