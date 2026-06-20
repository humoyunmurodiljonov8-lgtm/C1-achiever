import { useMemo } from 'react'
import { Award, BookOpen, Headphones, PenTool, FileText, MessageSquare, ChevronRight, LogOut } from 'lucide-react'
import { COLORS, scoreToCefr } from '../lib/helpers'
import { CefrBar } from './ResultsScreen'

function SectionCard({ icon: Icon, title, description, count, onClick, accent }) {
  return (
    <button
      onClick={onClick}
      className="text-left w-full p-5 rounded-2xl border transition-all hover:shadow-lg"
      style={{ background: COLORS.paper, borderColor: COLORS.border }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: accent + '1A' }}>
          <Icon size={20} style={{ color: accent }} />
        </div>
        <ChevronRight size={18} style={{ color: COLORS.ink, opacity: 0.3 }} />
      </div>
      <h3 className="text-lg mb-1" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>{title}</h3>
      <p className="text-sm mb-3" style={{ color: COLORS.muted }}>{description}</p>
      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: accent }}>{count}</span>
    </button>
  )
}

export default function Home({ onNavigate, results, userName, onLogout }) {
  const overallPct = useMemo(() => {
    const vals = Object.values(results).filter(r => r && typeof r.pct === 'number')
    if (!vals.length) return null
    return Math.round(vals.reduce((a, b) => a + b.pct, 0) / vals.length)
  }, [results])
  const cefr = overallPct !== null ? scoreToCefr(overallPct) : null

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm" style={{ color: COLORS.muted }}>Salom, <strong style={{ color: COLORS.ink }}>{userName || 'Talaba'}</strong></span>
        <button onClick={onLogout} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: COLORS.muted }}>
          <LogOut size={14} /> Chiqish
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ background: COLORS.ink, color: COLORS.goldLight }}>
          <Award size={13} /> Multilevel Exam Prep
        </div>
        <h1 className="text-4xl mb-2" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>C1 Achiever</h1>
        <p style={{ color: COLORS.muted }}>O'zbekiston Multilevel imtihoniga C1 darajasida tayyorgarlik</p>
      </div>

      <div className="bg-white rounded-2xl border p-5 mb-8 flex flex-col items-center gap-4" style={{ borderColor: COLORS.border }}>
        <CefrBar level={cefr || 'B2'} />
        <p className="text-sm text-center" style={{ color: COLORS.muted }}>
          {overallPct !== null
            ? <>Hozirgi taxminiy darajangiz: <strong style={{ color: COLORS.ink }}>{cefr}</strong> ({overallPct}%)</>
            : "Mashqlarni boshlang — darajangiz shu yerda ko'rinadi"}
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => onNavigate('mock')}
          className="w-full p-6 rounded-2xl text-left transition-transform"
          style={{ background: `linear-gradient(135deg, ${COLORS.ink}, ${COLORS.inkLight})` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.goldLight }}>Full Mock Test</span>
              <h2 className="text-2xl text-white mt-1 mb-1" style={{ fontFamily: 'Georgia, serif' }}>To'liq imtihon simulyatsiyasi</h2>
              <p className="text-sm" style={{ color: '#C9CEDB' }}>5 bo'lim · ketma-ket · yakuniy CEFR baho</p>
            </div>
            <ChevronRight size={28} className="text-white" style={{ opacity: 0.6 }} />
          </div>
        </button>
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: COLORS.muted }}>Bo'limlar bo'yicha mashq</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <SectionCard icon={BookOpen} title="Reading" description="3 matn, har biri 4-5 savol bilan" count={results.reading ? `Oxirgi natija: ${results.reading.pct}%` : "Hali sinab ko'rilmagan"} accent={COLORS.ink} onClick={() => onNavigate('reading')} />
        <SectionCard icon={Headphones} title="Listening" description="3 audio (TTS), transkript bilan" count={results.listening ? `Oxirgi natija: ${results.listening.pct}%` : "Hali sinab ko'rilmagan"} accent="#2563EB" onClick={() => onNavigate('listening')} />
        <SectionCard icon={PenTool} title="Use of English" description="Grammatika va lug'at, 4 turdagi topshiriq" count={results.useofenglish ? `Oxirgi natija: ${results.useofenglish.pct}%` : "Hali sinab ko'rilmagan"} accent="#7C3AED" onClick={() => onNavigate('useofenglish')} />
        <SectionCard icon={FileText} title="Writing" description="Essay, Report, Formal Letter" count={results.writing ? 'Bajarilgan' : "Hali sinab ko'rilmagan"} accent={COLORS.success} onClick={() => onNavigate('writing')} />
        <SectionCard icon={MessageSquare} title="Speaking" description="3 qism: Interview, Long Turn, Discussion" count={results.speaking ? 'Bajarilgan' : "Hali sinab ko'rilmagan"} accent={COLORS.danger} onClick={() => onNavigate('speaking')} />
      </div>
    </div>
  )
}
