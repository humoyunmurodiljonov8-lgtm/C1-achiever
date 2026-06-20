import { useState } from 'react'
import { readingData } from '../lib/data'
import { COLORS } from '../lib/helpers'
import TopBar from './TopBar'
import BottomNav from './BottomNav'
import ResultsScreen from './ResultsScreen'

export default function Reading({ onHome, onFinish, mockMode }) {
  const [passageIdx, setPassageIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const passage = readingData[passageIdx]

  function selectAnswer(qIdx, optIdx) {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [`${passage.id}_${qIdx}`]: optIdx }))
  }

  function calcResults() {
    let correct = 0, total = 0
    readingData.forEach(p => {
      p.questions.forEach((q, qIdx) => {
        total++
        if (answers[`${p.id}_${qIdx}`] === q.correct) correct++
      })
    })
    return { correct, total, pct: Math.round((correct / total) * 100) }
  }

  if (submitted) {
    const res = calcResults()
    return (
      <ResultsScreen
        title="Reading"
        result={res}
        onHome={onHome}
        onRetry={() => { setSubmitted(false); setAnswers({}); setPassageIdx(0) }}
        onContinue={mockMode ? () => onFinish(res) : null}
        detail={
          <div className="space-y-3 mt-4">
            {readingData.map(p => (
              <div key={p.id} className="text-sm">
                <strong style={{ color: COLORS.ink }}>{p.title}</strong>
                <div className="flex gap-1 mt-1">
                  {p.questions.map((q, qIdx) => {
                    const ok = answers[`${p.id}_${qIdx}`] === q.correct
                    return <span key={qIdx} className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold" style={{ background: ok ? COLORS.successBg : COLORS.dangerBg, color: ok ? COLORS.success : COLORS.danger }}>{qIdx + 1}</span>
                  })}
                </div>
              </div>
            ))}
          </div>
        }
      />
    )
  }

  return (
    <div className="pb-24">
      <TopBar onHome={onHome} title={`Reading · Matn ${passageIdx + 1}/${readingData.length}`} />
      <div className="max-w-4xl mx-auto px-5 py-6 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: COLORS.border }}>
          <h2 className="text-xl mb-4" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>{passage.title}</h2>
          <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#3A3A3A" }}>
            {passage.text}
          </div>
        </div>
        <div className="space-y-4">
          {passage.questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-white rounded-2xl border p-5" style={{ borderColor: COLORS.border }}>
              <p className="font-medium text-sm mb-3" style={{ color: COLORS.ink }}>{qIdx + 1}. {q.q}</p>
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const selected = answers[`${passage.id}_${qIdx}`] === optIdx
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
      <BottomNav
        canPrev={passageIdx > 0}
        canNext={passageIdx < readingData.length - 1}
        onPrev={() => setPassageIdx(i => i - 1)}
        onNext={() => setPassageIdx(i => i + 1)}
        onSubmit={() => setSubmitted(true)}
        isLast={passageIdx === readingData.length - 1}
      />
    </div>
  )
}
