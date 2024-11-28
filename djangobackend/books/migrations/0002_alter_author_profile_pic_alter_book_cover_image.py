# Generated by Django 5.1.3 on 2024-11-20 11:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='author',
            name='profile_pic',
            field=models.ImageField(blank=True, default='authors/profile_default.jpg', null=True, upload_to='authors/'),
        ),
        migrations.AlterField(
            model_name='book',
            name='cover_image',
            field=models.ImageField(blank=True, default='books/default_book.jpg', null=True, upload_to='books/'),
        ),
    ]
