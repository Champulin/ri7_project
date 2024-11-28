from django.db import models
from django.db.models import Avg
from django.db.models.signals import post_save
from django.dispatch import receiver

# Author model
class Author(models.Model):
    name = models.CharField(max_length=255)
    bio = models.TextField()
    profile_pic = models.ImageField(upload_to='authors/', default='authors/profile_default.jpg')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

# Book model
class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    description = models.TextField()
    cover_image = models.ImageField(upload_to='books/', default='books/default_book.jpg')
    rating = models.IntegerField(default=0)  # 1-10
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def update_rating(self):
        """Calculate the average rating from UserBook entries related to this book."""
        average_rating = UserBook.objects.filter(book=self).aggregate(Avg('rating'))['rating__avg']
        
        # If there are ratings, update the rating; otherwise, set it to 0
        if average_rating:
            self.rating = round(average_rating)  # Round the rating to the nearest integer
        else:
            self.rating = 0
        
        # Only save the book if its rating has actually changed (to prevent recursion)
        # Check if the book's rating has been changed, to avoid unnecessary recursion
        if self.rating != getattr(self, '_previous_rating', None):
            self._previous_rating = self.rating  # Store the previous rating to prevent recursion
            self.save()

    def save(self, *args, **kwargs):
        """Override save method to update the rating before saving the book."""
        self._previous_rating = None  # Initialize the previous rating variable
        super().save(*args, **kwargs)

