// URL конфигурация основанная на режиме сборки

// В Vite используется import.meta.env.PROD для определения production режима
const isProd = import.meta.env.PROD;

// Базовые URL для разных окружений
const PROD_URL = 'https://amlacademy.kz';
const DEV_URL = 'http://localhost:8444';

// Экспорт URL сконфигурированных в зависимости от окружения
export const base_url = isProd ? PROD_URL : DEV_URL;

export default base_url;