// All calls to the AccessML backend live here.
// Uses the same VITE_API_URL setting as the other pages (set it in Vercel for production).
const BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/+$/, '')

async function post(path, body) {
  let res
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Cannot reach the AI service. The server may be waking up, so try again in a moment.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const d = data.detail
    const msg =
      typeof d === 'string'
        ? d
        : Array.isArray(d)
          ? d.map((e) => `${e.loc?.slice(1).join('.')}: ${e.msg}`).join('; ')
          : `Request failed (${res.status}).`
    throw new Error(msg)
  }
  return data
}

export const debugCode = (code, output) => post('/tutor/debug', { code, output }).then((d) => d.reply)
export const askTutor = (question, lessonId = null) =>
  post('/tutor/ask', { question, lesson_id: lessonId }).then((d) => d.reply)