from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

# Create your models here.
class CustomAccountManager(BaseUserManager):
    def create_user(self, email, username, first_name, last_name, password, **other_fields):
        if not email:
            raise ValueError(gettext_lazy('Vous devez fournir une adresse email'))
        if not username:
            raise ValueError(gettext_lazy('Vous devez fournir un nom d\'utilisateur'))
        if not first_name:
            raise ValueError(gettext_lazy('Vous devez fournir un prénom'))
        if not last_name:
            raise ValueError(gettext_lazy('Vous devez fournir un nom de famille'))
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, first_name=first_name, last_name=last_name, **other_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, email, username, first_name, last_name, password, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)

        if other_fields.get('is_staff') is not True:
            raise ValueError(gettext_lazy('Superuser doit être assigné à is_staff=True'))
        if other_fields.get('is_superuser') is not True:
            raise ValueError(gettext_lazy('Superuser doit être assigné à is_superuser=True'))
        return self.create_user(email, username, first_name, last_name, password, **other_fields)

#create a user model using django abstract user model
class NewUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(
        gettext_lazy('email address'),
        unique=True,
    )
    username = models.CharField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    about = models.TextField(gettext_lazy('about'), blank=True, null=True)
    profile_pic = models.ImageField(upload_to='users/', blank=True, null=True, default='users/profile_default.jpg')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    objects = CustomAccountManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name'    ]

    def __str__(self):
        return self.username + self.email

