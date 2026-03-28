# 開発ステップ
`※ FE = フロントエンド BE = バックエンド`
## Step 1 — 環境構築・土台づくり ✅ 完了

- [x] Vite + React + Tailwind CSS セットアップ
- [x] Django + DRF + CORS セットアップ
- [x] フロント・バック疎通確認
- [x] MySQL接続・マイグレーション

---

## Step 2 — ユーザー認証 ← 次のステップ

- [ ] メール認証API（登録・ログイン・JWT発行）`BE`
- [ ] Google OAuth `BE`
- [ ] ログイン・新規登録画面 `FE`

---

## Step 3 — タスク・スケジュールのCRUD

- [ ] DBモデル設計（Task・Schedule・Habit）`BE`
- [ ] CRUD APIエンドポイント `BE`
- [ ] タスク入力・一覧画面 `FE`
- [ ] スケジュールビュー（ドラッグ&ドロップ）`FE`

---

## Step 4 — AI機能の組み込み

- [ ] Anthropic API連携（タスク分類・優先順位）`BE`
- [ ] AI提案UI（承認・修正・却下）`FE`

---

## Step 5 — 習慣トラッキング・リマインダー

- [ ] 習慣記録機能（継続日数・達成率）`両方`
- [ ] リマインダー通知（Web Push）`両方`