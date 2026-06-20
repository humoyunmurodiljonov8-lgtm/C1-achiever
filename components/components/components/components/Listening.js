import { useState, useEffect } from 'react'
import { Volume2, Play, Pause } from 'lucide-react'
import { listeningData } from '../lib/data'
import { COLORS, speak } from '../lib/helpers'
import TopBar from './TopBar'
import BottomNav from './BottomNav'
import ResultsScreen from './ResultsScreen'

export default function Listening({ onHome, onFinish, mockMode }) {
  const [trackIdx, setTrackIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const track = listeningData[trackIdx]

  useEffect(() => {
    return () => { if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel() }
  }, [trackIdx])

  function togglePlay() {
    if (playing) {
      window.speechSynthesis.cancel()
      setPlaying(false)
      return
    }
    const utter = speak(track.transcript)
    if (utter) {
      setPlaying(true)
      utter.onend = () => setPlaying(false)
    }
  }

  function selectAnswer(qIdx, optIdx) {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [`${track.id}_${qIdx}`]: optIdx }))
  }

  function calcResults() {
    let correct = 0, total = 0
    listeningData.forEach(t => {
      t.questions.forEach((q, qIdx) => {
        total++
        if (answers[`${t.id}_${qIdx}`] === q.correct) correct++
      })
    })
    return { correct, total, pct: Math.round((correct / total) * 100) }
  }

  if (submitted) {
    const res = calcResults()
    return <ResultsScreen title="Listening" result={res} onHome={onHome} onRetry={() => { setSubmitted(false); setAnswers({}); setTrackIdx(0) }} onContinue={mockMode ? () => onFinish(res) : null} />
  }

  return (
    <div className="pb-24">
      <TopBar onHome={onHome} title={`Listening · Audio ${trackIdx + 1}/${listeningData.length}`} />
      <div className="max-w-3xl mx-auto px-5 py-6">
        <div className="bg-white rounded-2xl border p-6 mb-6" style={{ borderColor: COLORS.border }}>
          <h2 className="text-xl mb-4" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>{track.title}</h2>
          <div className="flex items-center gap-3 mb-3">
            <button onClick={togglePlay} className="w-14 h-14 rounded-full flex items-center justify-center transition" style={{ background: COLORS.ink, color: "white" }}>
              {playing ? <Pause size={22} /> : <Play size={22} />}
            </button>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: COLORS.ink }}>{playing ? "Eshitilmoqda..." : "Audio yo'q (TTS orqali o'qib eshittiriladi)"}</p>
              <p className="text-xs" style={{ color: COLORS.muted }}>Bosing va diqqat bilan tinglang. Kerak bo'lsa qayta tinglashingiz mumkin.</p>
            </div>
            <Volume2 size={20} style={{ color: COLORS.muted }} />
          </div>
          <button onClick={() => setShowTranscript(s => !s)} className="text-xs font-semibold underline" style={{ color: COLORS.muted }}>
            {showTranscript ? "Transkriptni yashirish" : "Transkriptni ko'rsatish (yordam uchun)"}
          </button>
          {showTranscript && (
            <p className="text-sm mt-3 p-3 rounded-lg whitespace-pre-line" style={{ background: COLORS.cream, color: "#3A3A3A" }}>{track.transcript}</p>
          )}
        </div>

        <div className="space-y-4">
          {track.questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-white rounded-2xl border p-5" style={{ borderColor: COLORS.border }}>
              <p className="font-medium text-sm mb-3" style={{ color: COLORS.ink }}>{qIdx + 1}. {q.q}</p>
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const selected = answers[`${track.id}_${qIdx}`] === optIdx
                  return (
                    <button key={optIdx} onClick={() => selectAnswer(qIdx, optIdx)} className="w-full text-left text-sm px-3 py-2 rounded-lg border transition" style={{ background: selected ? COLORS.ink : "white", color: selected ? "white" : "#3A3A3A", borderColor: selected ? COLORS.ink : COLORS.border }}>
                      {String.fromCharCode(65 + optIdx)}. {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav canPrev={trackIdx > 0} canNext={trackIdx < listeningData.length - 1} onPrev={() => setTrackIdx(i => i - 1)} onNext={() => setTrackIdx(i => i + 1)} onSubmit={() => setSubmitted(true)} isLast={trackIdx === listeningData.length - 1} />
    </div>
  )
}
