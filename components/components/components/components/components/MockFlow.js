import { useState } from 'react'
import { Award } from 'lucide-react'
import { COLORS, scoreToCefr } from '../lib/helpers'
import { CefrBar } from './ResultsScreen'
import Reading from './Reading'
import Listening from './Listening'
import UseOfEnglish from './UseOfEnglish'
import Writing from './Writing'
import Speaking from './Speaking'

export default function MockFlow({ onHome, onMockComplete }) {
  const order = ['reading', 'listening', 'useofenglish', 'writing', 'speaking']
  const [step, setStep] = useState(0)
  const [results, setResults] = useState({})
  const [showFinal, setShowFinal] = useState(false)

  function handleFinish(key, res) {
    const updated = { ...results, [key]: res }
    setResults(updated)
    if (step < order.length - 1) {
      setStep(s => s + 1)
    } else {
      setShowFinal(true)
      if (onMockComplete) onMockComplete(updated)
    }
  }

  if (showFinal) {
    const scored = Object.entries(results).filter(([k]) => k === 'reading' || k === 'listening' || k === 'useofenglish')
    const avgPct = scored.length ? Math.round(scored.reduce((a, [, v]) => a + v.pct, 0) / scored.length) : 0
    const cefr = scoreToCefr(avgPct)
    return (
      <div className="max-w-2xl mx-auto px-5 py-12 text-center">
        <Award size={48} style={{ color: COLORS.gold }} className="mx-auto mb-4" />
        <h2 className="text-3xl mb-2" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>To'liq Mock Test yakunlandi!</h2>
        <p className="text-sm mb-6" style={{ color: COLORS.muted }}>Barcha 5 bo'lim bajarildi. Quyida natijalaringiz keltirilgan.</p>
        <div className="bg-white rounded-2xl border p-6 mb-6" style={{ borderColor: COLORS.border }}>
          <CefrBar level={cefr} />
          <p className="text-sm mt-4" style={{ color: COLORS.muted }}>Reading/Listening/Use of English bo'yicha o'rtacha: <strong style={{ color: COLORS.ink }}>{avgPct}%</strong> → <strong style={{ color: COLORS.ink }}>{cefr}</strong></p>
          <div className="grid grid-cols-2 gap-3 mt-5 text-left">
            {Object.entries(results).map(([k, v]) => (
              <div key={k} className="text-sm p-3 rounded-lg" style={{ background: COLORS.cream }}>
                <span className="capitalize font-semibold" style={{ color: COLORS.ink }}>{k}</span>
                <p style={{ color: COLORS.muted }}>{k === 'writing' || k === 'speaking' ? 'Bajarildi (ekspert baholashi kerak)' : `${v.pct}%`}</p>
              </div>
            ))}
          </div>
        </div>
        <button onClick={onHome} className="px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: COLORS.ink }}>Bosh sahifaga qaytish</button>
      </div>
    )
  }

  const current = order[step]
  const props = { onHome, mockMode: true, onFinish: (res) => handleFinish(current, res) }

  return (
    <div>
      <div className="px-5 pt-3">
        <div className="max-w-3xl mx-auto flex items-center gap-1.5 mb-1">
          {order.map((s, i) => (
            <div key={s} className="flex-1 h-1.5 rounded-full" style={{ background: i <= step ? COLORS.gold : COLORS.border }} />
          ))}
        </div>
        <p className="max-w-3xl mx-auto text-xs text-center" style={{ color: COLORS.muted }}>Mock Test · Bo'lim {step + 1}/5</p>
      </div>
      {current === 'reading' && <Reading {...props} />}
      {current === 'listening' && <Listening {...props} />}
      {current === 'useofenglish' && <UseOfEnglish {...props} />}
      {current === 'writing' && <Writing {...props} />}
      {current === 'speaking' && <Speaking {...props} />}
    </div>
  )
}
