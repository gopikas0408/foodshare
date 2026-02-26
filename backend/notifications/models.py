from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL


class Notification(models.Model):
    TYPE_CHOICES = [
        ('new_request', 'New Request'),
        ('request_accepted', 'Request Accepted'),
        ('request_declined', 'Request Declined'),
        ('post_expiring', 'Post Expiring'),
        ('post_completed', 'Post Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField(blank=True)
    related_id = models.IntegerField(blank=True, null=True)
    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title