from django.contrib import admin
from .models import FoodPost, FoodImage, FoodRequest

admin.site.register(FoodPost)
admin.site.register(FoodImage)
admin.site.register(FoodRequest)
