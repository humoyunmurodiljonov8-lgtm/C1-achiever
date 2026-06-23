import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { COLORS } from '../lib/helpers'
import Auth from '../components/Auth'
import Home from '../components/Home'
import Reading from '../components/Reading'
import Listening from '../components/Listening'
import UseOfEnglish from '../components/UseOfEnglish'
import Writing from '../components/Writing'
import Speaking from '../components/Speaking'
import MockFlow from '../components/MockFlow'

export default function App() {
  const [session, setSession] = useState(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [screen, setScreen] = useState('home')
  const [results, setResults] = useState({})

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoadingSession(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) loadResults()
  }, [session])

  async function loadResults() {
    const { data, error } = await supabase
      .from('results')
      .select('section, pct, correct, total')
      .eq('user_id', session.user.id)
    if (!error && data) {
      const map = {}
      data.forEach(r => { map[r.section] = { pct: r.pct, correct: r.correct, total: r.total } })
      setResults(map)
    }
  }

  async function saveResult(section, res) {
    setResults(prev => ({ ...prev, [section]: res }))
    if (!session) return
    await supabase.from('results').upsert({
      user_id: session.user.id,
      section,
      pct: res.pct,
      correct: res.correct,
      total: res.total,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,section' })
  }

  function navigate(target) { setScreen(target) }
  function goHome() { setScreen('home') }
  async function handleLogout() {
    await supabase.auth.signOut()
    setScreen('home')
  }

  if (loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.cream }}>
        <p style={{ color: COLORS.muted }}>Yuklanmoqda...</p>
      </div>
    )
  }

  if (!session) {
    return <Auth onAuthed={(s) => setSession(s)} />
  }

  const userName = session.user.user_metadata?.full_name || session.user.email

  return (
    <div className="min-h-screen font-sans" style={{ background: COLORS.cream }}>
      {screen === 'home' && <Home onNavigate={navigate} results={results} userName={userName} onLogout={handleLogout} />}
      {screen === 'reading' && <Reading onHome={goHome} onFinish={(res) => saveResult('reading', res)} mockMode={false} />}
      {screen === 'listening' && <Listening onHome={goHome} onFinish={(res) => saveResult('listening', res)} mockMode={false} />}
      {screen === 'useofenglish' && <UseOfEnglish onHome={goHome} onFinish={(res) => saveResult('useofenglish', res)} mockMode={false} />}
      {screen === 'writing' && <Writing onHome={goHome} onFinish={(res) => saveResult('writing', res)} mockMode={false} />}
      {screen === 'speaking' && <Speaking onHome={goHome} onFinish={(res) => saveResult('speaking', res)} mockMode={false} />}
      {screen === 'mock' && (
        <MockFlow
          onHome={goHome}
          onMockComplete={(allResults) => {
            Object.entries(allResults).forEach(([section, res]) => saveResult(section, res))
          }}
        />
      )}
    </div>
  )
        }
