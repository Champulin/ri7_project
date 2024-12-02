from django.db import models
from django.db.models import Avg
from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import NewUser

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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def update_rating(self):
        """Calculate the average rating from Review entries related to this book."""
        average_rating = Review.objects.filter(book=self).aggregate(Avg('rating'))['rating__avg']
        
        # If there are ratings, update the rating; otherwise, set it to 0
        if average_rating:
            calculated_rating = round(average_rating)  # Round the rating to the nearest integer
        else:
            calculated_rating = 0
        
        # Only save the book if its rating has actually changed (to prevent recursion)
        if calculated_rating != getattr(self, '_previous_rating', None):
            self._previous_rating = calculated_rating  # Store the previous rating to prevent recursion
            self.rating = calculated_rating
            self.save()

    def save(self, *args, **kwargs):
        """Override save method to update the rating before saving the book."""
        self._previous_rating = None  # Initialize the previous rating variable
        self.update_rating()  # Ensure the rating is calculated before saving
        super().save(*args, **kwargs)
class Review(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.ForeignKey(NewUser, on_delete=models.CASCADE)
    review = models.TextField()
    rating = models.PositiveIntegerField(choices=[(i, str(i)) for i in range(1, 11)], default=1)
    reading_status = models.CharField(max_length=1, choices=[('L', 'Lu'), ('E', 'En cours'), ('A', 'À lire')], default='A')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('book', 'user')

    def __str__(self):
        return f'{self.user.username} - {self.book.title}'