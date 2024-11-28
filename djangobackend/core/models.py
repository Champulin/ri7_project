from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import NewUser
from books.models import Book  # Ensure you import the Book model

class UserBook(models.Model):
    user = models.ForeignKey(NewUser, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    review = models.TextField()
    rating = models.IntegerField(default=0)
    reading_status = models.CharField(max_length=1, choices=[('L', 'Read'), ('E', 'In Progress'), ('A', 'To Read')], default='A')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.username} - {self.book.title}'

# Signal receiver example
@receiver(post_save, sender=UserBook)
def update_user_book(sender, instance, created, **kwargs):
    if created:
        print(f"New UserBook created: {instance.user.username} read {instance.book.title}")
    else:
        print(f"UserBook updated: {instance.user.username} updated their review for {instance.book.title}")
