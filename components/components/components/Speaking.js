import { useState } from 'react'
import { Volume2, CheckCircle2 } from 'lucide-react'
import { speakingData } from '../lib/data'
import { COLORS, speak } from '../lib/helpers'
import TopBar from './TopBar'
import BottomNav from './BottomNav'

export default function Speaking({ onHome, onFinish, mockMode }) {
  const [taskIdx, setTaskIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)
  const task = speakingData[taskIdx]

  function playPrompt(text) { speak(text, { rate: 0.92 }) }

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <CheckCircle2 size={48} style={{ color: COLORS.success }} className="mx-auto mb-4" />
        <h2 className="text-2xl mb-2" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>Speaking bo'limi yakunlandi</h2>
        <p className="text-sm mb-6" style={{ color: COLORS.muted }}>Javoblaringiz nutq uslubida yozildi. Haqiqiy imtihonda bu qismni ovozli yozib, ekspert baholaydi — fluency, pronunciation, grammar va vocabulary bo'yicha.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onHome} className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: COLORS.cream, color: COLORS.ink, border: `1px solid ${COLORS.border}` }}>Bosh sahifa</button>
          {mockMode && <button onClick={() => onFinish({ correct: 1, total: 1, pct: 100 })} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: COLORS.ink }}>Yakunlash →</button>}
        </div>
      </div>
    )
  }

  return (
    <div className="pb-24">
      <TopBar onHome={onHome} title={`Speaking · ${task.part}`} />
      <div className="max-w-3xl mx-auto px-5 py-6">
        <div className="bg-white rounded-2xl border p-6 mb-4" style={{ borderColor: COLORS.border }}>
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.gold }}>{task.part}</span>
          <h2 className="text-xl mt-1 mb-2" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>{task.title}</h2>
          <p className="text-xs" style={{ color: COLORS.muted }}>{task.instructions}</p>
        </div>

        {task.prompt && (
          <div className="bg-white rounded-2xl border p-5 mb-4" style={{ borderColor: COLORS.border }}>
            <div className="flex items-start gap-3 mb-3">
              <button onClick={() => playPrompt(task.prompt)} className="p-2 rounded-full shrink-0" style={{ background: COLORS.ink, color: 'white' }}><Volume2 size={16} /></button>
              <p className="text-sm" style={{ color: '#3A3A3A' }}>{task.prompt}</p>
            </div>
            <textarea value={answers[task.id] || ''} onChange={e => setAnswers(prev => ({ ...prev, [task.id]: e.target.value }))} rows={8} placeholder="Javobingizni yozing (gapirayotgandagidek)..." className="w-full text-sm p-3 rounded-lg focus:outline-none resize-none" style={{ background: COLORS.cream, color: '#3A3A3A' }} />
          </div>
        )}

        {task.questions && task.questions.map((q, qIdx) => (
          <div key={qIdx} className="bg-white rounded-2xl border p-5 mb-4" style={{ borderColor: COLORS.border }}>
            <div className="flex items-start gap-3 mb-3">
              <button onClick={() => playPrompt(q)} className="p-2 rounded-full shrink-0" style={{ background: COLORS.ink, color: 'white' }}><Volume2 size={16} /></button>
              <p className="text-sm" style={{ color: '#3A3A3A' }}>{qIdx + 1}. {q}</p>
            </div>
            <textarea value={answers[`${task.id}_${qIdx}`] || ''} onChange={e => setAnswers(prev => ({ ...prev, [`${task.id}_${qIdx}`]: e.target.value }))} rows={3} placeholder="Javobingizni yozing..." className="w-full text-sm p-3 rounded-lg focus:outline-none resize-none" style={{ background: COLORS.cream, color: '#3A3A3A' }} />
          </div>
        ))}
      </div>
      <BottomNav canPrev={taskIdx > 0} canNext={taskIdx < speakingData.length - 1} onPrev={() => setTaskIdx(i => i - 1)} onNext={() => setTaskIdx(i => i + 1)} onSubmit={() => setDone(true)} isLast={taskIdx === speakingData.length - 1} />
    </div>
  )
}
