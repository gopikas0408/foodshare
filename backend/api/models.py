from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL


class FoodPost(models.Model):
    CATEGORY_CHOICES = [
        ('vegetables', 'Vegetables'),
        ('fruits', 'Fruits'),
        ('bread', 'Bread'),
        ('meals', 'Meals'),
        ('dairy', 'Dairy'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('available', 'Available'),
        ('assigned', 'Assigned'),
        ('completed', 'Completed'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    ]

    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='food_posts')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    quantity = models.CharField(max_length=100)

    pickup_location = models.CharField(max_length=255)
    available_until = models.DateTimeField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    views = models.IntegerField(default=0)
    request_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class FoodImage(models.Model):
    post = models.ForeignKey(FoodPost, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='food_images/')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class FoodRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    post = models.ForeignKey(FoodPost, on_delete=models.CASCADE, related_name='requests')
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='food_requests')
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    pickup_time = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('post', 'requester')

    def __str__(self):
        return f"{self.requester} → {self.post}"