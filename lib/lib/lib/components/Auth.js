import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { COLORS } from '../lib/helpers'
import { Award } from 'lucide-react'

export default function Auth({ onAuthed }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      })
      setLoading(false)
      if (error) {
        setError(error.message)
        return
      }
      if (data?.user && !data.session) {
        setInfo('Ro\'yxatdan o\'tish muvaffaqiyatli! Emailingizni tekshirib, tasdiqlash havolasini bosing.')
        return
      }
      onAuthed(data.session)
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (error) {
        setError(error.message)
        return
      }
      onAuthed(data.session)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: COLORS.cream }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ background: COLORS.ink, color: COLORS.goldLight }}>
            <Award size={13} /> Multilevel Exam Prep
          </div>
          <h1 className="text-4xl mb-2" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>C1 Achiever</h1>
          <p className="text-sm" style={{ color: COLORS.muted }}>
            {mode === 'login' ? 'Hisobingizga kiring' : 'Yangi hisob yarating'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: COLORS.border }}>
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Ism Familiya</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full mt-1 px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                style={{ borderColor: COLORS.border, background: COLORS.cream }}
                placeholder="Ism Familiya"
              />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
              style={{ borderColor: COLORS.border, background: COLORS.cream }}
              placeholder="email@misol.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Parol</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
              style={{ borderColor: COLORS.border, background: COLORS.cream }}
              placeholder="Kamida 6 ta belgi"
            />
          </div>

          {error && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ background: COLORS.dangerBg, color: COLORS.danger }}>{error}</p>
          )}
          {info && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ background: COLORS.successBg, color: COLORS.success }}>{info}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: COLORS.ink }}
          >
            {loading ? 'Iltimos kuting...' : mode === 'login' ? 'Kirish' : 'Ro\'yxatdan o\'tish'}
          </button>
        </form>

        <p className="text-center text-sm mt-4" style={{ color: COLORS.muted }}>
          {mode === 'login' ? (
            <>Hisobingiz yo'qmi?{' '}
              <button onClick={() => { setMode('signup'); setError(''); setInfo(''); }} className="font-semibold underline" style={{ color: COLORS.ink }}>Ro'yxatdan o'tish</button>
            </>
          ) : (
            <>Hisobingiz bormi?{' '}
              <button onClick={() => { setMode('login'); setError(''); setInfo(''); }} className="font-semibold underline" style={{ color: COLORS.ink }}>Kirish</button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
