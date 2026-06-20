import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useOfEnglishData } from '../lib/data'
import { COLORS } from '../lib/helpers'
import TopBar from './TopBar'
import BottomNav from './BottomNav'
import ResultsScreen from './ResultsScreen'

export default function UseOfEnglish({ onHome, onFinish, mockMode }) {
  const tasks = ['cloze', 'wordformation', 'transformation', 'multiplechoice']
  const [taskIdx, setTaskIdx] = useState(0)
  const [clozeAnswers, setClozeAnswers] = useState({})
  const [wfAnswers, setWfAnswers] = useState({})
  const [transAnswers, setTransAnswers] = useState({})
  const [mcAnswers, setMcAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const taskKey = tasks[taskIdx]

  function calcResults() {
    let correct = 0, total = 0
    const cloze = useOfEnglishData.cloze
    cloze.answers.forEach((ans, i) => {
      total++
      if ((clozeAnswers[i] || '').trim().toLowerCase() === ans.toLowerCase()) correct++
    })
    useOfEnglishData.wordformation.items.forEach((item, i) => {
      total++
      if ((wfAnswers[i] || '').trim().toLowerCase() === item.answer.toLowerCase()) correct++
    })
    useOfEnglishData.transformation.items.forEach((item, i) => {
      total++
      const given = (transAnswers[i] || '').trim().toLowerCase().replace(/\s+/g, ' ')
      if (given === item.answer.toLowerCase()) correct++
    })
    useOfEnglishData.multiplechoice.items.forEach((item, i) => {
      total++
      if (mcAnswers[i] === item.correct) correct++
    })
    return { correct, total, pct: Math.round((correct / total) * 100) }
  }

  if (submitted) {
    const res = calcResults()
    return <ResultsScreen title="Use of English" result={res} onHome={onHome} onRetry={() => { setSubmitted(false); setClozeAnswers({}); setWfAnswers({}); setTransAnswers({}); setMcAnswers({}); setTaskIdx(0) }} onContinue={mockMode ? () => onFinish(res) : null} />
  }

  return (
    <div className="pb-24">
      <TopBar onHome={onHome} title={`Use of English · ${taskIdx + 1}/${tasks.length}`} />
      <div className="max-w-3xl mx-auto px-5 py-6">
        {taskKey === 'cloze' && (
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: COLORS.border }}>
            <h2 className="text-xl mb-1" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>{useOfEnglishData.cloze.title}</h2>
            <p className="text-xs mb-4" style={{ color: COLORS.muted }}>{useOfEnglishData.cloze.instructions}</p>
            <p className="text-sm leading-loose">
              {useOfEnglishData.cloze.parts.map((part, i) => {
                if (typeof part === 'string' && /^\d+$/.test(part) && i % 2 === 1) {
                  const gapNum = parseInt(part) - 1
                  return (
                    <input key={i} value={clozeAnswers[gapNum] || ''} onChange={e => setClozeAnswers(prev => ({ ...prev, [gapNum]: e.target.value }))} className="inline-block w-20 mx-1 px-2 py-0.5 border-b-2 text-center font-semibold focus:outline-none" style={{ borderColor: COLORS.gold, background: COLORS.cream }} placeholder={`(${gapNum + 1})`} />
                  )
                }
                return <span key={i}>{part}</span>
              })}
            </p>
          </div>
        )}

        {taskKey === 'wordformation' && (
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: COLORS.border }}>
            <h2 className="text-xl mb-1" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>{useOfEnglishData.wordformation.title}</h2>
            <p className="text-xs mb-4" style={{ color: COLORS.muted }}>{useOfEnglishData.wordformation.instructions}</p>
            <div className="space-y-4">
              {useOfEnglishData.wordformation.items.map((item, i) => (
                <div key={i} className="text-sm">
                  <p style={{ color: '#3A3A3A' }}>{i + 1}. {item.sentence}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: COLORS.cream, color: COLORS.muted }}>{item.base}</span>
                    <ChevronRight size={14} style={{ color: COLORS.muted }} />
                    <input value={wfAnswers[i] || ''} onChange={e => setWfAnswers(prev => ({ ...prev, [i]: e.target.value }))} className="px-2 py-1 border-b-2 text-sm focus:outline-none" style={{ borderColor: COLORS.gold }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {taskKey === 'transformation' && (
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: COLORS.border }}>
            <h2 className="text-xl mb-1" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>{useOfEnglishData.transformation.title}</h2>
            <p className="text-xs mb-4" style={{ color: COLORS.muted }}>{useOfEnglishData.transformation.instructions}</p>
            <div className="space-y-5">
              {useOfEnglishData.transformation.items.map((item, i) => (
                <div key={i} className="text-sm pb-4 border-b last:border-0" style={{ borderColor: COLORS.border }}>
                  <p style={{ color: '#3A3A3A' }} className="mb-1">{i + 1}. {item.sentence1}</p>
                  <p className="text-xs font-bold mb-2" style={{ color: COLORS.gold }}>{item.keyword}</p>
                  <p style={{ color: '#3A3A3A' }}>
                    {item.template.split('___________')[0]}
                    <input value={transAnswers[i] || ''} onChange={e => setTransAnswers(prev => ({ ...prev, [i]: e.target.value }))} className="inline-block w-56 mx-1 px-2 py-1 border-b-2 text-sm focus:outline-none" style={{ borderColor: COLORS.gold }} />
                    {item.template.split('___________')[1]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {taskKey === 'multiplechoice' && (
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: COLORS.border }}>
            <h2 className="text-xl mb-1" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>{useOfEnglishData.multiplechoice.title}</h2>
            <p className="text-xs mb-4" style={{ color: COLORS.muted }}>{useOfEnglishData.multiplechoice.instructions}</p>
            <div className="space-y-4">
              {useOfEnglishData.multiplechoice.items.map((item, i) => (
                <div key={i}>
                  <p className="text-sm mb-2" style={{ color: '#3A3A3A' }}>{i + 1}. {item.sentence}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.options.map((opt, optIdx) => {
                      const selected = mcAnswers[i] === optIdx
                      return (
                        <button key={optIdx} onClick={() => setMcAnswers(prev => ({ ...prev, [i]: optIdx }))} className="text-xs px-3 py-1.5 rounded-full border transition" style={{ background: selected ? COLORS.ink : 'white', color: selected ? 'white' : '#3A3A3A', borderColor: selected ? COLORS.ink : COLORS.border }}>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomNav canPrev={taskIdx > 0} canNext={taskIdx < tasks.length - 1} onPrev={() => setTaskIdx(i => i - 1)} onNext={() => setTaskIdx(i => i + 1)} onSubmit={() => setSubmitted(true)} isLast={taskIdx === tasks.length - 1} />
    </div>
  )
}
