import { ghostButtonClass, kickerClass } from './ui'

function Modal({ open, title, subtitle, onClose, children }) {
  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-auto rounded-2xl border border-slate-200 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className={kickerClass}>Cadastro</p>
            <h3 id="modal-title" className="text-xl font-semibold text-slate-950">
              {title}
            </h3>
            {subtitle ? <p className="text-sm leading-6 text-slate-600">{subtitle}</p> : null}
          </div>
          <button type="button" className={ghostButtonClass} onClick={onClose}>
            Fechar
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export default Modal
