import random
from django.core.management.base import BaseCommand
from users.models import NewUser
from books.models import Author, Book


class Command(BaseCommand):
    help = 'Seed the database with initial data for users and books'

    def handle(self, *args, **kwargs):
        self.seed_users()
        self.seed_authors_and_books()

    def seed_users(self):
        users = [
            {
                "email": f"user{i}@example.com",
                "username": f"user{i}",
                "first_name": f"FirstName{i}",
                "last_name": f"LastName{i}",
                "password": "password123",
            }
            for i in range(1, 6)
        ]

        for user_data in users:
            if not NewUser.objects.filter(email=user_data["email"]).exists():
                user = NewUser.objects.create_user(
                    email=user_data["email"],
                    username=user_data["username"],
                    first_name=user_data["first_name"],
                    last_name=user_data["last_name"],
                    password=user_data["password"],
                )
                user.save()
                self.stdout.write(self.style.SUCCESS(f"User {user.username} created"))
            else:
                self.stdout.write(self.style.WARNING(f"User {user_data['email']} already exists"))

    def seed_authors_and_books(self):
        # Seed Authors
        authors = []
        for i in range(1, 6):
            author_name = f"Author {i}"
            bio = f"This is the bio of {author_name}."
            profile_pic = f"authors/author_{i}.jpg"  # Ensure images exist in media/authors/

            author, created = Author.objects.get_or_create(
                name=author_name,
                bio=bio,
                profile_pic=profile_pic,
            )
            authors.append(author)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Author '{author_name}' created."))
            else:
                self.stdout.write(self.style.WARNING(f"Author '{author_name}' already exists."))

        # Seed Books
        for i in range(1, 6):
            book_title = f"Manga {i}"
            description = f"This is the description of {book_title}."
            cover_image = f"books/book_{i}.jpg"  # Ensure images exist in media/books/

            # Assign a random author from the seeded authors
            author = random.choice(authors)

            # Skip the rating update during seeding
            book = Book(
                title=book_title,
                author=author,
                description=description,
                cover_image=cover_image,
            )
            book._skip_rating_update = True  # Skip rating update during seeding
            book.save()

            if book.pk:
                self.stdout.write(self.style.SUCCESS(f"Book '{book_title}' created."))
            else:
                self.stdout.write(self.style.WARNING(f"Book '{book_title}' already exists."))
