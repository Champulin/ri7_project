from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser  # Make sure parsers are imported
from rest_framework.parsers import JSONParser
from rest_framework import status
from users.models import NewUser 
from .serializers import UserSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request, user_id):
        try:
            # Fetch the user by ID
            user = NewUser.objects.get(id=user_id)
            user_data = {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "about": user.about,
                "profile_pic": user.profile_pic.url if user.profile_pic else None,
            }
            return Response(user_data)
        except NewUser.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can update their profile
    parser_classes = [MultiPartParser, FormParser]  # Support file uploads (images)

    def patch(self, request, user_id):
        try:
            user = NewUser.objects.get(id=user_id)
        except NewUser.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)

        # Ensure the user is updating their own profile
        if user != request.user:
            return Response({"detail": "You are not allowed to edit this user's data."}, status=403)

        # Use serializer to update user data
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            # Handle profile_pic if it's provided
            if 'profile_pic' in request.FILES:
                user.profile_pic = request.FILES['profile_pic']
            serializer.save()  # Save the updated user data
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)