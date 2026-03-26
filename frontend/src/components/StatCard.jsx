import { kickerClass, panelClass } from './ui'

function StatCard({ label, value, hint }) {
  return (
    <article className={`${panelClass} space-y-3 p-4`}>
      <span className={kickerClass}>{label}</span>
      <strong className="block text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </strong>
      <p className="text-sm leading-6 text-slate-600">{hint}</p>
    </article>
  )
}

export default StatCard
