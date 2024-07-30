from django.db import models
from django.utils import timezone
from django.conf import settings
from django.utils.text import slugify
from django_ckeditor_5.fields import CKEditor5Field
from django.utils.html import strip_tags
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

class Post(models.Model):
    FILTER_CHOICES = [
        ('quick-read', 'Quick Read'),
        ('coffee-read', 'Coffee Read'),
    ]
    SAVETYPE_CHOICES = [
        ('published', 'Published'),
        ('draft', 'Draft'),
    ]

    title = models.CharField(max_length=100, null=True)
    mini_description = models.CharField(max_length=255, null=True)
    content = CKEditor5Field(config_name='extends', blank=True, null=True)
    date_posted = models.DateTimeField(default=timezone.now)
    main_small_photo = models.URLField(max_length=255, null=True, blank=True)
    main_photo = models.URLField(max_length=255, null=True, blank=True)
    reading_category = models.CharField(max_length=50, choices=FILTER_CHOICES, null=True, blank=True)
    save_type = models.CharField(max_length=50, choices=SAVETYPE_CHOICES, null=True, blank=True)
    slug = models.SlugField(unique=True, max_length=255, blank=True)

    def save(self, *args, **kwargs):
        # Generate slug if not present
        if not self.slug:
            self.slug = slugify(self.title)

        # Save the initial data, including the slug
        super().save(*args, **kwargs)

        # Handle the 'published' save_type
        if self.save_type == 'published':
            self.send_email_to_subscribers()
        

    def send_email_to_subscribers(self):
        # Get the personal links first
        basic_info = BasicInfo.objects.all()
        
        for item in basic_info:
            github_link = item.github_link
            linkedin_link = item.linkedin_link

        website_link = settings.WEBSITE_LINK
        print(website_link)
        subscribers = Subscribe.objects.all()
        for subscriber in subscribers:
            uid = urlsafe_base64_encode(force_bytes(subscriber.email))
            unsubscribe_url = reverse('blog:unsubscribe', kwargs={'uidb64': uid})
            unsubscribe_link = f'{website_link}{unsubscribe_url}'
            subject = f'New Post: {self.title}'
            html_message = render_to_string('email/new_post.html', {
                'post': self, 
                'website_link' : website_link, 
                'unsubscribe_link' : unsubscribe_link,
                'github_link' :github_link,
                'linkedin_link' : linkedin_link
                })
            plain_message = strip_tags(html_message)
            from_email = 'youremail@email.com'
            to = subscriber.email

            send_mail(subject, plain_message, from_email, [to], html_message=html_message)

    def get_absolute_url(self):
        return reverse('blog:post_detail_view', kwargs={'slug': self.slug})

    def __str__(self):
        return self.title or 'No Title'
            
class Subscribe(models.Model):
    email = models.EmailField(unique=True)
    subscribed_on = models.DateTimeField(auto_now_add=False, null=True)

    def __str__(self):
        return self.email
    

class BasicInfo(models.Model):
    my_email = models.EmailField(unique=True)
    github_link = models.CharField(max_length=255, null=True)
    my_website = models.CharField(max_length=255, null=True)
    linkedin_link = models.CharField(max_length=255, null=True)

    def __str__(self):
        return self.my_email