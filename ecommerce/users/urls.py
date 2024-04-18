from django.urls import path
from .views import LoginView, UserProfileView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("profile/", UserProfileView.as_view(), name="profile")
]
