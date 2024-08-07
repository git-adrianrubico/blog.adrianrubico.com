# Generated by Django 5.0.7 on 2024-07-29 16:10

import django.utils.timezone
import django_ckeditor_5.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BasicInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('my_email', models.EmailField(max_length=254, unique=True)),
                ('github_link', models.CharField(max_length=255, null=True)),
                ('my_website', models.CharField(max_length=255, null=True)),
                ('linkedin_link', models.CharField(max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100, null=True)),
                ('mini_description', models.CharField(max_length=255, null=True)),
                ('content', django_ckeditor_5.fields.CKEditor5Field(blank=True, null=True)),
                ('date_posted', models.DateTimeField(default=django.utils.timezone.now)),
                ('main_small_photo', models.URLField(blank=True, max_length=255, null=True)),
                ('main_photo', models.URLField(blank=True, max_length=255, null=True)),
                ('reading_category', models.CharField(blank=True, choices=[('quick-read', 'Quick Read'), ('coffee-read', 'Coffee Read')], max_length=50, null=True)),
                ('save_type', models.CharField(blank=True, choices=[('published', 'Published'), ('draft', 'Draft')], max_length=50, null=True)),
                ('slug', models.SlugField(blank=True, max_length=255, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Subscribe',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('subscribed_on', models.DateTimeField(null=True)),
            ],
        ),
    ]
