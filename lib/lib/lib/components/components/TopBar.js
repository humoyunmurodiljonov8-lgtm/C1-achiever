import { Award, Home } from 'lucide-react'
import { COLORS } from '../lib/helpers'

export default function TopBar({ onHome, title }) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 backdrop-blur-sm border-b" style={{ background: "rgba(250,248,243,0.92)", borderColor: COLORS.border }}>
      <button onClick={onHome} className="flex items-center gap-2 text-lg" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>
        <Award size={20} style={{ color: COLORS.gold }} />
        <span className="hidden sm:inline">C1 Achiever</span>
      </button>
      {title && <span className="text-sm font-medium" style={{ color: COLORS.muted }}>{title}</span>}
      <button onClick={onHome} className="p-2 rounded-full hover:bg-black/5 transition">
        <Home size={18} style={{ color: COLORS.ink }} />
      </button>
    </div>
  )
}
