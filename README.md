# PoliteraX Authentication Landing

Официальная страница аутентификации для сервера **PoliteraX**.

## Что делает сайт
- Собирает ник Minecraft.
- Запрашивает Telegram username.
- Позволяет выбрать тип аккаунта: **Minecraft** или **ely.by**.
- Переводит пользователя в Telegram-бота `@politerax_auth_bot` с параметром `/start`.
- Показывает fallback-блок с ссылкой и готовой командой `/start`, если Telegram не открылся автоматически.

## Запуск локально
```bash
python3 -m http.server 4173
```
Открой: `http://127.0.0.1:4173`

## Файлы
- `index.html` — разметка и контент страницы.
- `styles.css` — стили и адаптивный UI.
- `script.js` — валидация и логика перехода в Telegram.
