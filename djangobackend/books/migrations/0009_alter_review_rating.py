# Generated by Django 5.1.3 on 2024-11-29 14:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0008_review_reading_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='review',
            name='rating',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
