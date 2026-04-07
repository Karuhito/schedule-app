from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import ai_views

router = DefaultRouter()
router.register(r'tasks', views.TaskViewSet, basename='task')
router.register(r'habits', views.HabitViewSet, basename='habit')
router.register(r'habitlogs', views.HabitLogViewSet, basename='habitlog')

urlpatterns = [
    path('', include(router.urls)),
    path('ai/prioritize/', ai_views.analyze_and_prioritize),
    path('ai/apply/', ai_views.apply_priorities),
]