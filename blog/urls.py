from django.urls import path
from django.views.generic import TemplateView
from .views import (
    HomePageView, 
    post_detail_view, 
    all_posts, 
    load_more_posts, 
    subscribe, 
    unsubscribe, 
    feed_view, 
    TermsofUseView, 
    PrivacyPolicyView, 
)

app_name = 'blog'

urlpatterns = [
  path('', HomePageView.as_view(), name='home'),
  path('posts/', all_posts, name='all_posts'),
  path('post/<slug:slug>/', post_detail_view, name='post_detail_view'),
  path('load_more_posts/', load_more_posts, name='load_more_posts'),
  path('subscribe/', subscribe, name="subscribe"),
  path('unsubscribe/<uidb64>', unsubscribe, name='unsubscribe'),
  path('unsubscribe_success', TemplateView.as_view(template_name='email/unsubscribe_success.html'), name='unsubscribe_success'),
  path('unsubscribe_error', TemplateView.as_view(template_name='email/unsubscribe_error.html'), name='unsubscribe_error'),
  path('rss_feed/', feed_view, name="latest_rss_feed"),
  path('terms_of_use/', TermsofUseView.as_view(), name='terms_of_use'),
  path('privacy_policy/', PrivacyPolicyView.as_view(), name='privacy_policy'),
]