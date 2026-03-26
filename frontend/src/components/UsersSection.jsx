import {
  dangerButtonClass,
  headingRowClass,
  inputClass,
  kickerClass,
  panelClass,
  panelTitleClass,
  pillClass,
  primaryButtonClass,
} from './ui'

function UsersSection({
  sessionUser,
  userForm,
  setUserForm,
  userDeleteId,
  setUserDeleteId,
  onSubmitUpdate,
  onDeleteUser,
  onOpenCreateUser,
}) {
  return (
    <div className="space-y-4">
      <section className={`${panelClass} space-y-5`}>
        <div className={headingRowClass}>
          <div className="space-y-2">
            <p className={kickerClass}>Usuarios</p>
            <h2 className={panelTitleClass}>Conta logada e operacoes disponiveis</h2>
          </div>
          <button type="button" className={primaryButtonClass} onClick={onOpenCreateUser}>
            Criar usuario
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          <strong className="block text-slate-800">Observacao da API</strong>
          O controller de usuarios nao expone listagem. Por isso a tela trabalha
          com cadastro, autenticacao, atualizacao e exclusao por ID.
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <span className={kickerClass}>Sessao atual</span>
            <h3 className="mt-2 text-lg font-semibold text-slate-950">
              {sessionUser?.name || 'Usuario autenticado'}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {sessionUser?.email || '-'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={pillClass}>ID {sessionUser?.id || '-'}</span>
              <span className={pillClass}>{sessionUser?.role || 'User'}</span>
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <span className={kickerClass}>Exclusao</span>
            <h3 className="mt-2 text-lg font-semibold text-slate-950">
              Desativar usuario
            </h3>
            <div className="mt-4 space-y-2">
              <label htmlFor="delete-user-id" className="text-sm font-medium text-slate-700">
                ID do usuario
              </label>
              <input
                id="delete-user-id"
                value={userDeleteId}
                onChange={(event) => setUserDeleteId(event.target.value)}
                className={inputClass}
                placeholder="Informe o ID"
              />
            </div>
            <div className="mt-4">
              <button type="button" className={dangerButtonClass} onClick={onDeleteUser}>
                Excluir usuario
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className={`${panelClass} space-y-5`}>
        <div className="space-y-2">
          <p className={kickerClass}>Atualizacao</p>
          <h2 className={panelTitleClass}>Editar usuario por ID</h2>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmitUpdate}>
          <div className="space-y-2">
            <label htmlFor="user-id" className="text-sm font-medium text-slate-700">
              ID
            </label>
            <input
              id="user-id"
              value={userForm.id}
              onChange={(event) =>
                setUserForm((current) => ({
                  ...current,
                  id: event.target.value,
                }))
              }
              className={inputClass}
              placeholder="1"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="user-name" className="text-sm font-medium text-slate-700">
              Nome
            </label>
            <input
              id="user-name"
              value={userForm.nome}
              onChange={(event) =>
                setUserForm((current) => ({
                  ...current,
                  nome: event.target.value,
                }))
              }
              className={inputClass}
              placeholder="Nome do usuario"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="user-email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="user-email"
              type="email"
              value={userForm.email}
              onChange={(event) =>
                setUserForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              className={inputClass}
              placeholder="usuario@empresa.com"
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className={primaryButtonClass}>
              Salvar ajustes
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default UsersSection
