from django.test import TestCase
from django.contrib.auth import get_user_model
#Test to create a new superuser
class UserAccountTests(TestCase):
    def test_new_superuser(self):
        db = get_user_model()
        super_user = db.objects.create_superuser(
            'testuser@super.com', 'username', 'firstname', 'lastname', 'password123', is_superuser=True, is_staff=True, is_active=True
        )
        self.assertEqual(super_user.email, 'testuser@super.com')
        self.assertEqual(super_user.username, 'username')
        self.assertEqual(super_user.first_name, 'firstname')
        self.assertEqual(super_user.last_name, 'lastname')
        self.assertTrue(super_user.is_superuser)
        self.assertTrue(super_user.is_staff)
        self.assertTrue(super_user.is_active)

        with self.assertRaises(ValueError):
            db.objects.create_superuser(
                email='testuser@super.com', username='username', first_name='firstname', last_name='lastname', password='password123', is_superuser=False)
        with self.assertRaises(ValueError):
            db.objects.create_superuser(
                email='testuser@super.com', username='username', first_name='firstname', last_name='lastname', password='password123', is_staff=False)
    def test_new_user(self):
        db = get_user_model()
        user = db.objects.create_user(
            'testuse2r@user.com', 'username2', 'firstname2', 'lastname2', 'password123')
        self.assertEqual(user.email, 'testuse2r@user.com')
        self.assertEqual(user.username, 'username2')
        self.assertEqual(user.first_name, 'firstname2')
        self.assertEqual(user.last_name, 'lastname2')
        self.assertFalse(user.is_superuser)
        self.assertFalse(user.is_staff)
        self.assertTrue(user.is_active)

        with self.assertRaises(ValueError):
            db.objects.create_user(
                email='testuser@user.com', username='', first_name='firstname', last_name='lastname', password='password123',)

        with self.assertRaises(ValueError):
            db.objects.create_user(
                email='testuser@user.com', username='username', first_name='', last_name='lastname', password='33',)
        with self.assertRaises(ValueError):
            db.objects.create_user(
                email='', username='username', first_name='firstname', last_name='tre', password='password123')
        with self.assertRaises(ValueError):
            db.objects.create_user(
                email='testuser@user.com', username='', first_name='', last_name='lastname', password='password123')