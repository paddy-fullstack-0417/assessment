from django.urls import path
from app.views import RegisterView, LoginView, TokenView, AdView

urlpatterns = [
    path('login/', LoginView.as_view()),
    path('register/', RegisterView.as_view()),
    path('token/', TokenView.as_view()),
    path('ads/', AdView.as_view()),
]
