const TELEGRAM_BOT = 'politerax_auth_bot';
const TEST_PROFILE = 'IBrop_test';

const guestView = document.getElementById('guest-view');
const authView = document.getElementById('auth-view');
const guestStatus = document.getElementById('guest-status');
const authStatus = document.getElementById('auth-status');
const tokenInfo = document.getElementById('token-info');
const profileSelect = document.getElementById('profile-select');
const loginBtn = document.getElementById('login-btn');
const enterProfileBtn = document.getElementById('enter-profile-btn');

function setStatus(element, message, type = '') {
  element.textContent = message;
  element.className = `status ${type}`.trim();
}

function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    authToken: params.get('auth_token') || '',
    profile: params.get('profile') || '',
    profiles: params.get('profiles') || '',
  };
}

function buildStartPayload() {
  return `auth_minecraft_${TEST_PROFILE}_telegramtest`;
}

function openTelegramLogin() {
  const payload = buildStartPayload();
  const botUrl = `https://t.me/${TELEGRAM_BOT}?start=${payload}`;
  setStatus(
    guestStatus,
    'Открываю Telegram. Подтверди вход и нажми кнопку, чтобы вернуться на сайт с токеном.',
    'success'
  );
  window.open(botUrl, '_blank', 'noopener,noreferrer');
}

function uniqueProfiles(profile, profilesRaw) {
  const list = profilesRaw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (profile) list.unshift(profile);
  if (!list.includes(TEST_PROFILE)) list.push(TEST_PROFILE);

  return [...new Set(list)];
}

function renderAuthorized(authToken, selectedProfile, profilesRaw) {
  guestView.hidden = true;
  authView.hidden = false;

  const profiles = uniqueProfiles(selectedProfile, profilesRaw);
  profileSelect.innerHTML = '';

  profiles.forEach((profileName) => {
    const option = document.createElement('option');
    option.value = profileName;
    option.textContent = profileName;
    profileSelect.appendChild(option);
  });

  tokenInfo.textContent = `Токен получен: ${authToken.slice(0, 8)}... Выбери профиль и продолжи.`;
  setStatus(authStatus, 'Авторизация через Telegram подтверждена.', 'success');
}

function enterProfile() {
  const selected = profileSelect.value;
  localStorage.setItem('politeraxProfile', selected);
  setStatus(authStatus, `Готово! Вход выполнен в профиль: ${selected}`, 'success');
}

function init() {
  loginBtn.addEventListener('click', openTelegramLogin);
  enterProfileBtn.addEventListener('click', enterProfile);

  const { authToken, profile, profiles } = getParams();
  if (!authToken) {
    setStatus(guestStatus, 'Для входа используй кнопку «Войти в аккаунт».');
    return;
  }

  renderAuthorized(authToken, profile, profiles);
}

init();
