import { COLORS } from '../lib/helpers'

export default function BottomNav({ canPrev, canNext, onPrev, onNext, onSubmit, isLast }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 px-5 py-3 flex items-center justify-between border-t backdrop-blur-sm" style={{ background: "rgba(250,248,243,0.95)", borderColor: COLORS.border }}>
      <button disabled={!canPrev} onClick={onPrev} className="px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-30" style={{ background: "white", color: COLORS.ink, border: `1px solid ${COLORS.border}` }}>Oldingi</button>
      {isLast ? (
        <button onClick={onSubmit} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: COLORS.success }}>Yakunlash</button>
      ) : (
        <button onClick={onNext} disabled={!canNext} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-30" style={{ background: COLORS.ink }}>Keyingi</button>
      )}
    </div>
  )
}
