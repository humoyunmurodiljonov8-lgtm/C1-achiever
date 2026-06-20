import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react'
import { COLORS, CEFR_LEVELS, scoreToCefr } from '../lib/helpers'

export function CefrBar({ level }) {
  const idx = CEFR_LEVELS.indexOf(level)
  return (
    <div className="flex items-center gap-1 select-none">
      {CEFR_LEVELS.map((lv, i) => (
        <div key={lv} style={{ display: 'contents' }}>
          <div className="flex flex-col items-center gap-1" style={{ opacity: i <= idx ? 1 : 0.35 }}>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2"
              style={{
                background: i === idx ? COLORS.gold : i < idx ? COLORS.ink : "transparent",
                borderColor: i <= idx ? COLORS.ink : COLORS.border,
                color: i === idx ? COLORS.ink : i < idx ? COLORS.cream : COLORS.muted
              }}
            >
              {lv}
            </div>
          </div>
          {i < CEFR_LEVELS.length - 1 && (
            <div className="h-0.5 w-4 sm:w-8" style={{ background: i < idx ? COLORS.ink : COLORS.border }} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function ResultsScreen({ title, result, onHome, onRetry, onContinue, detail }) {
  const cefr = scoreToCefr(result.pct)
  const good = result.pct >= 65
  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: good ? COLORS.successBg : COLORS.dangerBg }}>
          {good ? <CheckCircle2 size={36} style={{ color: COLORS.success }} /> : <XCircle size={36} style={{ color: COLORS.danger }} />}
        </div>
        <h2 className="text-2xl mb-1" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>{title} natijasi</h2>
        <p className="text-4xl font-bold mb-2" style={{ color: COLORS.ink }}>{result.correct}/{result.total}</p>
        <p className="text-sm mb-4" style={{ color: COLORS.muted }}>{result.pct}% to'g'ri · Taxminiy daraja: <strong style={{ color: COLORS.ink }}>{cefr}</strong></p>
        <CefrBar level={cefr} />
      </div>
      {detail}
      <div className="flex gap-3 justify-center mt-8">
        <button onClick={onHome} className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "white", color: COLORS.ink, border: `1px solid ${COLORS.border}` }}>Bosh sahifa</button>
        <button onClick={onRetry} className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2" style={{ background: COLORS.cream, color: COLORS.ink, border: `1px solid ${COLORS.border}` }}><RotateCcw size={14} /> Qayta urinish</button>
        {onContinue && <button onClick={onContinue} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: COLORS.ink }}>Keyingi bo'lim →</button>}
      </div>
    </div>
  )
}
