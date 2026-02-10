const form = document.getElementById('register-form');
const statusEl = document.getElementById('status');
const fallbackEl = document.getElementById('fallback');
const botLinkEl = document.getElementById('bot-link');
const startCommandEl = document.getElementById('start-command');
const copyCommandButton = document.getElementById('copy-command');

const TELEGRAM_BOT = 'politerax_auth_bot';

function showStatus(message, type = '') {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`.trim();
}

function normalizeTg(value) {
  const cleaned = value.trim().replace(/^@+/, '');
  return cleaned ? `@${cleaned}` : '';
}

function validNickname(name) {
  return /^[a-zA-Z0-9_]{3,16}$/.test(name);
}

function validTelegram(username) {
  return /^@[a-zA-Z0-9_]{5,32}$/.test(username);
}

function buildStartParam({ nickname, telegram, authMethod }) {
  const safeNick = nickname.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 16);
  const safeTg = telegram.replace(/[^a-zA-Z0-9_@]/g, '').replace('@', '').slice(0, 32);
  const safeAuth = authMethod === 'elyby' ? 'elyby' : 'minecraft';
  return `auth_${safeAuth}_${safeNick}_${safeTg}`.slice(0, 64);
}

function showFallback(botUrl, startParam) {
  botLinkEl.href = botUrl;
  startCommandEl.textContent = `/start ${startParam}`;
  fallbackEl.hidden = false;
}

async function copyStartCommand() {
  const value = startCommandEl.textContent;
  if (!value) return;

  try {
    await navigator.clipboard.writeText(value);
    showStatus('Команда /start для аутентификации скопирована в буфер обмена.', 'success');
  } catch {
    showStatus('Не удалось скопировать команду. Скопируй вручную из блока ниже.', 'error');
  }
}

copyCommandButton.addEventListener('click', () => {
  copyStartCommand();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const nickname = String(formData.get('nickname') || '').trim();
  const telegram = normalizeTg(String(formData.get('telegram') || ''));
  const authMethod = String(formData.get('authMethod') || 'minecraft');
  const rulesAccepted = document.getElementById('rules').checked;

  if (!validNickname(nickname)) {
    showStatus('Ник должен быть от 3 до 16 символов и содержать только буквы, цифры и _.', 'error');
    return;
  }

  if (!validTelegram(telegram)) {
    showStatus('Введи корректный Telegram username в формате @username.', 'error');
    return;
  }

  if (!rulesAccepted) {
    showStatus('Нужно принять правила сервера, чтобы продолжить аутентификацию.', 'error');
    return;
  }

  const startParam = buildStartParam({ nickname, telegram, authMethod });
  const botUrl = `https://t.me/${TELEGRAM_BOT}?start=${startParam}`;

  showFallback(botUrl, startParam);
  showStatus('Переход в Telegram-бота аутентификации... Если не открылось, используй кнопку и команду ниже.', 'success');
  window.open(botUrl, '_blank', 'noopener,noreferrer');
});
