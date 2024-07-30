from django.contrib import admin
from .models import Post, Subscribe, BasicInfo

class PostDetails(admin.ModelAdmin):
    list_display = ('title', 'date_posted',)
    list_filter = ('date_posted',)
    search_fields = ('title', 'date_posted',)
    ordering = ('-date_posted',)

class SubscribeAdmin(admin.ModelAdmin):
    list_display = ('email', )
    readonly_fields = ('subscribed_on')

admin.site.register(Post, PostDetails)
admin.site.register(Subscribe)
admin.site.register(BasicInfo)