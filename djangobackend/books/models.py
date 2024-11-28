from django.db import models

# Create your models here.
#create author model
class Author(models.Model):
    name = models.CharField(max_length=255)
    bio = models.TextField()
    profile_pic = models.ImageField(upload_to='authors/', default='authors/profile_default.jpg')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name

#create a book model
class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField()
    cover_image = models.ImageField(upload_to='books/',  default='books/default_book.jpg')
    rating = models.IntegerField(default=0) #1-10
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title