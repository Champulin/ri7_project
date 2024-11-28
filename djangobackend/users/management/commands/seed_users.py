import random
from django.core.management.base import BaseCommand
from users.models import NewUser

class Command(BaseCommand):
    help = 'Seed the database with 5 users'

    def handle(self, *args, **kwargs):
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
