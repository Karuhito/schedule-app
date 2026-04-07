import json
# import anthropic
import google.generativeai as genai
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')
# client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_and_prioritize(request):
    tasks = Task.objects.filter(
        user=request.user,
        is_completed=False
    ).values(
        'id', 'title', 'description', 'category',
        'due_date', 'start_time', 'end_time', 'priority'
    )

    task_list = list(tasks)
    if not task_list:
        return Response(
            {'error': 'タスクがありません'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # タスク情報を文字列に変換
    tasks_text = '\n'.join([
        f"- ID:{t['id']} [{t['category']}] {t['title']}"
        f"{' 期限:' + str(t['due_date']) if t['due_date'] else ''}"
        f"{' ' + str(t['start_time'])[:5] + '〜' + str(t['end_time'])[:5] if t['start_time'] and t['end_time'] else ''}"
        for t in task_list
    ])

    prompt = f"""あなたは個人のスケジュール管理をサポートするAIアシスタントです。
以下のタスク一覧を分析し、重要度・インパクト・締め切りを考慮して優先順位を提案してください。

タスク一覧:
{tasks_text}

以下のJSON形式のみで回答してください。説明文は不要です。
{{
  "prioritized_tasks": [
    {{
      "id": タスクのID,
      "priority": 優先順位（1が最高）,
      "reason": "優先する理由（30文字以内）"
    }}
  ],
  "summary": "全体のスケジュールに関する一言アドバイス（50文字以内）"
}}"""
    response = model.generate_content(prompt)
    # レスポンスが空の場合のチェック
    if not response or not response.text:
        return Response(
            {'error': 'AIからのレスポンスが空でした'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    response_text = response.text.strip()
    
    # Geminiがマークダウンのコードブロックで返す場合の対処
    if response_text.startswith('```'):
        response_text = response_text.split('```')[1]
        if response_text.startswith('json'):
            response_text = response_text[4:]
        response_text = response_text.strip()

    try:
        result = json.loads(response_text)
    except json.JSONDecodeError:
        return Response(
            {'error': f'JSONの解析に失敗しました: {response_text}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response(result)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_priorities(request):
    prioritized_tasks = request.data.get('prioritized_tasks', [])
    if not prioritized_tasks:
        return Response(
            {'error': 'データがありません'},
            status=status.HTTP_400_BAD_REQUEST
        )

    for item in prioritized_tasks:
        Task.objects.filter(
            id=item['id'],
            user=request.user
        ).update(priority=item['priority'])

    tasks = Task.objects.filter(user=request.user, is_completed=False)
    return Response(TaskSerializer(tasks, many=True).data)