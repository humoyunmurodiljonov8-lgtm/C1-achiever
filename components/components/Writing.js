import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { writingData } from '../lib/data'
import { COLORS } from '../lib/helpers'
import TopBar from './TopBar'
import BottomNav from './BottomNav'

export default function Writing({ onHome, onFinish, mockMode }) {
  const [taskIdx, setTaskIdx] = useState(0)
  const [texts, setTexts] = useState({})
  const [done, setDone] = useState(false)
  const task = writingData[taskIdx]
  const text = texts[task.id] || ''
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const inRange = wordCount >= task.minWords * 0.85

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <CheckCircle2 size={48} style={{ color: COLORS.success }} className="mx-auto mb-4" />
        <h2 className="text-2xl mb-2" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>Writing bo'limi yakunlandi</h2>
        <p className="text-sm mb-6" style={{ color: COLORS.muted }}>
          Yozma ishlaringiz baholash mezonlari (content, organisation, language) bo'yicha o'z-o'zingizni tekshirishingiz uchun saqlanadi. Real imtihonda bu qism ekspert/AI tomonidan baholanadi.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={onHome} className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: COLORS.cream, color: COLORS.ink, border: `1px solid ${COLORS.border}` }}>Bosh sahifa</button>
          {mockMode && <button onClick={() => onFinish({ correct: 1, total: 1, pct: 100 })} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: COLORS.ink }}>Keyingi bo'lim →</button>}
        </div>
      </div>
    )
  }

  return (
    <div className="pb-24">
      <TopBar onHome={onHome} title={`Writing · Topshiriq ${taskIdx + 1}/${writingData.length}`} />
      <div className="max-w-3xl mx-auto px-5 py-6">
        <div className="bg-white rounded-2xl border p-6 mb-4" style={{ borderColor: COLORS.border }}>
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.gold }}>{task.type}</span>
          <h2 className="text-xl mt-1 mb-2" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>{task.title}</h2>
          <p className="text-xs mb-3" style={{ color: COLORS.muted }}>{task.instructions}</p>
          <p className="text-sm p-3 rounded-lg" style={{ background: COLORS.cream, color: '#3A3A3A' }}>{task.prompt}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {task.criteria.map(c => <span key={c} className="text-xs px-2 py-1 rounded-full" style={{ background: COLORS.successBg, color: COLORS.success }}>{c}</span>)}
          </div>
        </div>
        <div className="bg-white rounded-2xl border p-4" style={{ borderColor: COLORS.border }}>
          <textarea
            value={text}
            onChange={e => setTexts(prev => ({ ...prev, [task.id]: e.target.value }))}
            rows={14}
            placeholder="Javobingizni shu yerga yozing..."
            className="w-full text-sm p-3 rounded-lg focus:outline-none resize-none"
            style={{ background: COLORS.cream, color: '#3A3A3A' }}
          />
          <div className="flex items-center justify-between mt-2 text-xs">
            <span style={{ color: inRange ? COLORS.success : COLORS.danger }}>{wordCount} so'z (talab: {task.minWords}-{task.maxWords})</span>
          </div>
        </div>
      </div>
      <BottomNav canPrev={taskIdx > 0} canNext={taskIdx < writingData.length - 1} onPrev={() => setTaskIdx(i => i - 1)} onNext={() => setTaskIdx(i => i + 1)} onSubmit={() => setDone(true)} isLast={taskIdx === writingData.length - 1} />
    </div>
  )
}
