from django.contrib.syndication.views import Feed
from django.db.models.base import Model
from django.template.defaultfilters import truncatewords
from django.urls import reverse_lazy

from .models import Post

class LatestPostsFeed(Feed):
    title = 'DevBlog | Adrian Rubico'
    link = reverse_lazy('blog:all_posts')
    description = 'New Post'
    
    def items(self):
        return Post.objects.all()[:5]
    
    def item_title(self, item):
        return item.title
    
    def item_description(self, item):
        return truncatewords(item.mini_description, 30)

    def item_link(self, item):
        return reverse_lazy('blog:post_detail_view', kwargs={'slug': item.slug})
