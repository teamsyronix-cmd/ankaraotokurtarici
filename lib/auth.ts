import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

/**
 * Tek kullanıcılı yönetim paneli oturumu.
 * Kullanıcı adı, şifre ve imza anahtarı ortam değişkenlerinden okunur:
 *   ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SESSION_SECRET
 * Oturum, HMAC ile imzalanmış httpOnly bir çerezde tutulur (veritabanı gerekmez).
 */

export const SESSION_COOKIE = 'admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 8 // 8 saat

type Session = { u: string; exp: number }

function getConfig() {
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!username || !password || !secret || secret.length < 32) return null
  return { username, password, secret }
}

export function isAuthConfigured() {
  return getConfig() !== null
}

/** Uzunluk farkı sızdırmadan sabit zamanlı karşılaştırma */
function safeEqual(a: string, b: string) {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

function sign(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function checkCredentials(username: string, password: string) {
  const config = getConfig()
  if (!config) return false
  // İkisini de her zaman hesapla ki hangi alanın yanlış olduğu süreden anlaşılmasın
  const userOk = safeEqual(username, config.username)
  const passOk = safeEqual(password, config.password)
  return userOk && passOk
}

export async function createSession(username: string) {
  const config = getConfig()
  if (!config) throw new Error('Yönetim paneli yapılandırılmamış')

  const session: Session = {
    u: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  }
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url')
  const token = `${payload}.${sign(payload, config.secret)}`

  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
}

export async function deleteSession() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

export async function getSession(): Promise<Session | null> {
  const config = getConfig()
  if (!config) return null

  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null

  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null
  if (!safeEqual(signature, sign(payload, config.secret))) return null

  try {
    const session = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    ) as Session
    if (session.u !== config.username) return null
    if (session.exp < Date.now() / 1000) return null
    return session
  } catch {
    return null
  }
}
