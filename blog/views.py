from typing import Any
from django.http import JsonResponse, HttpResponse
from django.views.generic.base import TemplateView
from .models import Post, BasicInfo, Subscribe
from django.utils import timezone
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from django.core.exceptions import ValidationError
from django.template.loader import render_to_string
from django.utils import timezone
from django.views.decorators.cache import never_cache
from .forms import SubscribeForm
from django.views.decorators.csrf import csrf_protect
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMultiAlternatives
from .feeds import LatestPostsFeed

class HomePageView(TemplateView):
    template_name = 'blog/posts.html'

    def get(self, request, *args, **kwargs):
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            #print("homepage ajax")
            displayed_posts = int(request.GET.get('displayed_posts', 0))
            posts = Post.objects.all().order_by('-date_posted')[:displayed_posts]
            posts_count = posts.count()
            html_content = render_to_string('blog/all_posts.html', {'post': posts}, request=request)
            return JsonResponse({'html_content': html_content,'posts_count' : posts_count})
        else:
            #print("homepage non-ajax")
            # If it's not an AJAX request, proceed with the regular template
            return super().get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        #print("homepage get_context_data")
        context = super().get_context_data(**kwargs)
        posts = Post.objects.all().order_by('-date_posted')
        basic_info = BasicInfo.objects.all()

        displayed_posts = 5
        context['post'] = posts[:displayed_posts]
        remaining_posts = len(posts) - displayed_posts
        if remaining_posts > 0:
           #print(f"There are {remaining_posts} posts remaining.")
           remaining_posts = True
        else:
           #print("There are no posts remaining.")
           remaining_posts = False

        context['has_remaining_posts'] = remaining_posts
        context['basic_info'] = basic_info
        return context

def feed_view(request):
    feed = LatestPostsFeed()
    feed_content = feed(request)
    return HttpResponse(feed_content, content_type="application/xhtml+xml")

@csrf_protect
def unsubscribe(request, uidb64):
    basic_info = BasicInfo.objects.all()
    email = force_str(urlsafe_base64_decode(uidb64))
    if request.method == 'POST':
        try:
            subscriber = Subscribe.objects.get(email=email)
            subscriber.delete()
            messages.success(request, 'You have been successfully unsubscribed.')
            return redirect('blog:unsubscribe_success')  # Redirect to a success page or render a template directly
        except Subscribe.DoesNotExist:
            messages.error(request, 'Subscription not found.')
            return redirect('blog:unsubscribe_error')  # Redirect to an error page or render a template directly
    return render(request, 'email/unsubscribe_confirmation.html', {'email': email, 'basic_info': basic_info})

def send_confirmation_email(request, email):
    current_site = get_current_site(request)
    mail_subject = 'Thank you for subscribing to our blog!'
    uid = urlsafe_base64_encode(force_bytes(email))
    unsubscribe_url = reverse('blog:unsubscribe', kwargs={'uidb64': uid})
    unsubscribe_link = f'http://{current_site.domain}{unsubscribe_url}'

    basic_info = BasicInfo.objects.all()
    for item in basic_info:
            github_link = item.github_link
            linkedin_link = item.linkedin_link

    # Render HTML template
    html_content = render_to_string('email/subscription_email.html', {
        'unsubscribe_link': unsubscribe_link,
        'github_link' :github_link,
        'linkedin_link' : linkedin_link
    })


    # Create email
    email_message = EmailMultiAlternatives(
        subject=mail_subject,
        body=html_content,
        from_email='youremail@email.com',
        to=[email]
    )

    email_message.attach_alternative(html_content, "text/html")
    email_message.send()

@csrf_protect
def subscribe(request):
    if request.method == 'POST':
        form = SubscribeForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            try:
                # Create a new instance with validation
                new_subscriber = Subscribe(email=email, subscribed_on=timezone.now())
                new_subscriber.full_clean()  # Raise validation errors if any
                new_subscriber.save()

                # Send confirmation email
                send_confirmation_email(request, email)

                return JsonResponse({'status': 'success', 'message': 'You have been successfully subscribed!!!'})
            except ValidationError as error:
                # Handle the case where the email already exists
                return JsonResponse({'status': 'error', 'message': f'This {email} email is already subscribed.'})
        else:
           return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
    else:
        return JsonResponse({'status': 'error', 'errors': {'message': 'Invalid request method'}})

def load_more_posts(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        #print("loadmore ajax")
        # Get the current displayed posts count
        total_posts = Post.objects.all().count()
        displayed_posts = int(request.GET.get('displayed_posts', 0))

        # Load more posts (additional 5 posts)
        posts = Post.objects.all().order_by('-date_posted')[displayed_posts:displayed_posts+5]
        # print remaining post based on posts
        remaining_posts = total_posts - len(posts) - displayed_posts
        
        if (remaining_posts == 0):
            #("There are no posts remaining.")
            remaining_posts = False
        else:
            remaining_posts = True
            #print(remaining_posts)
            
        html_content = render_to_string('blog/post_loadmore.html', {'post_loadmore': posts}, request=request)
        
        return JsonResponse({'html_content': html_content,  'has_remaining_posts': remaining_posts})
    else:
        pass
        #print("loadmore else")

          
@never_cache        
def post_detail_view(request, slug):
    post = get_object_or_404(Post, slug=slug)
    post_datetime = post.date_posted.astimezone(timezone.get_current_timezone())
    post_time = post_datetime.strftime("%I:%M %p")
    basic_info = BasicInfo.objects.all()
    post_url = request.build_absolute_uri(post.get_absolute_url())

    form = SubscribeForm()
    
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        #print("ajax")
        context = {
            'post_detail': post,
            'post_time': post_time,
            'basic_info': basic_info,
            'subscribe_form': form,
        }
        html_content = render_to_string('blog/post_details.html', context, request=request)
        return JsonResponse({
            'html_content': html_content,
            'og_title': post.title,
            'og_description': post.mini_description,
            'og_image': post.main_photo,
            'og_url': post_url
        })
    else:
        #print("non-ajax")
        context = {
            'post_detail': post,
            'post_time': post_time,
            'basic_info': basic_info,
            'subscribe_form': form,
            'og_title': post.title,
            'og_description': post.mini_description,
            'og_image': post.main_photo,
            'og_url': post_url,
            'canonical_url': post_url
        }
        return render(request, 'blog/post_details_direct.html', context)

def all_posts(request):
    displayed_posts = int(request.GET.get('displayed_posts', 0))
    posts = Post.objects.all().order_by('-date_posted')[:displayed_posts]
    posts_count = posts.count()
    context = {'post': posts}
    
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        # If it's an AJAX request, return JSON response
        print("REQUEST AJAX all posts")
        html_content = render_to_string('blog/all_posts.html', context, request=request)
        return JsonResponse({'html_content': html_content,'posts_count' : posts_count})
    else:
        # If it's a regular page load, return HTML directly
        print("NON AJAX all posts")
        return redirect('blog:home')
    
class TermsofUseView(TemplateView):
    template_name = 'includes/terms_of_use.html'
    
class PrivacyPolicyView(TemplateView):
    template_name = 'includes/privacy_policy.html'   

def mainpage_404(request, exception):
    return render(request, "layouts/error-404.html", status=404)