from rest_framework import serializers
from .models import Task, Habit, HabitLog

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = (
            'id', 'title', 'description', 'category',
            'is_completed', 'priority', 'due_date',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class HabitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = ('id', 'title', 'category', 'created_at')
        read_only_fields = ('id', 'created_at')


class HabitLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitLog
        fields = ('id', 'habit', 'date', 'is_completed')
        read_only_fields = ('id',)