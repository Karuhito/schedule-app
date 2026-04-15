from rest_framework import viewsets, permissions
from .models import Task, Habit, HabitLog
from .serializers import TaskSerializer, HabitSerializer, HabitLogSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Task.objects.filter(user=self.request.user)

        # 日付フィルター
        date = self.request.query_params.get('date')
        no_date = self.request.query_params.get('no_date')
        if no_date == 'true':
            queryset = queryset.filter(due_date__isnull=True)
        elif date:
            queryset = queryset.filter(due_date=date)

        # カテゴリフィルター
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        # 未完了のみ絞り込み
        incomplete_only = self.request.query_params.get('incomplete_only')
        if incomplete_only == 'true':
            queryset = queryset.filter(is_completed=False)

        # ソート順
        sort = self.request.query_params.get('sort', 'asc')
        if sort == 'desc':
            queryset = queryset.order_by('-due_date', '-created_at')
        else:
            queryset = queryset.order_by('due_date', 'created_at')

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class HabitViewSet(viewsets.ModelViewSet):
    serializer_class = HabitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class HabitLogViewSet(viewsets.ModelViewSet):
    serializer_class = HabitLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return HabitLog.objects.filter(habit__user=self.request.user)