# /users/serializers.py

from rest_framework import serializers
from .models import NewUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['email', 'username', 'first_name', 'last_name', 'about', 'profile_pic', 'is_active', 'is_staff']  # Include all fields you want to update

    def update(self, instance, validated_data):
        profile_pic = validated_data.pop('profile_pic', None)
        if profile_pic:
            instance.profile_pic = profile_pic  # If profile_pic is provided, save it
        return super().update(instance, validated_data)
