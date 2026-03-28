# Schedule App

AIが優先順位を提案してくれる個人向けスケジュール管理アプリ。

やりたいことを入力するだけで、AIが重要度・インパクトをもとに整理してくれる。最終判断はユーザーが行い、AIは補助役に徹する。

---

## 技術スタック

| 領域 | 技術 |
|------|------|
| フロントエンド | React + Vite + Tailwind CSS |
| バックエンド | Django + Django REST Framework |
| データベース | MySQL |
| 認証 | Simple JWT + Google OAuth |
| AI連携 | Anthropic API |
| フロントデプロイ | Vercel |
| バックデプロイ | Railway / Render |

---

## ディレクトリ構成

```
schedule-app/
├── frontend/       # React (Vite)
└── backend/        # Django
```

---

## ローカル開発環境のセットアップ

### 必要なもの

- Node.js
- Python 3.12+
- MySQL
- Git

### バックエンド

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

`.env` ファイルを作成する（`.env.example` を参考に）。

```bash
python manage.py migrate
python manage.py runserver
```

### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

---

## 主な機能

- 自然文入力 → AIがタスク・予定に自動分類
- 重要度・インパクトをもとにAIが優先順位を提案
- 1日・1週間のスケジュールビュー
- ドラッグ&ドロップで手動調整
- 習慣トラッキング（継続日数・達成率）
- リマインダー通知

---

## 開発状況

- [x] 環境構築・土台づくり
- [x] ユーザー認証
- [ ] タスク・スケジュールのCRUD
- [ ] AI機能の組み込み
- [ ] 習慣トラッキング・リマインダー