from .models import Notification


def create_notification(user, type, title, message="", related_id=None):
    Notification.objects.create(
        user=user,
        type=type,
        title=title,
        message=message,
        related_id=related_id
    )