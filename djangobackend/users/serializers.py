# /users/serializers.py

from rest_framework import serializers
from .models import NewUser

from rest_framework import serializers
from users.models import NewUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'about', 'profile_pic']
        extra_kwargs = {
            'password': {'write_only': True},  # Ensure password is not returned in responses
        }

    def create(self, validated_data):
        # Use set_password to hash the password
        password = validated_data.pop('password')
        user = NewUser(**validated_data)
        user.set_password(password)  # Hash the password
        user.save()
        return user
