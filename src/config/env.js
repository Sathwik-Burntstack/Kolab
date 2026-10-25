// Central place for runtime configuration. Values come from .env (see .env.example).
export const USE_MOCK = String(import.meta.env.VITE_USE_MOCK ?? 'true') === 'true'
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
export const TOKEN_KEY = 'kolab_token'
