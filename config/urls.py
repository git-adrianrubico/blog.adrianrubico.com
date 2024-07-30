from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.sitemaps.views import sitemap
from blog.sitemaps import PostSitemap

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include("blog.urls")),
    path('sitemap.xml', sitemap, {'sitemaps': {'posts': PostSitemap}}, name='django.contrib.sitemaps.views.sitemap'),
    path("ckeditor5/", include("django_ckeditor_5.urls")),
]

handler404 = "blog.views.mainpage_404"

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)