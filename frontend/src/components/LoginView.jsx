import {
  headingRowClass,
  inputClass,
  kickerClass,
  noticeClass,
  panelClass,
  panelTitleClass,
  primaryButtonClass,
  secondaryButtonClass,
} from './ui'

function LoginView({
  notification,
  loginForm,
  setLoginForm,
  authLoading,
  onSubmit,
  onOpenCreateUser,
}) {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,460px)]">
      <section className="flex items-center border-b border-slate-200 px-6 py-10 lg:border-b-0 lg:border-r lg:px-12">
        <div className="max-w-xl space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Front-end API Contratos
          </h1>
          <p className="text-base leading-7 text-slate-600">
            Acesse a plataforma para consultar contratos, gerenciar clientes e
            operar as importacoes da API.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Usuarios', 'Clientes', 'Contratos', 'Arquivos'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center px-6 py-10 lg:px-8">
        <div className={`${panelClass} w-full space-y-5`}>
          <div className={headingRowClass}>
            <div className="space-y-2">
              <p className={kickerClass}>Acesso</p>
              <h2 className={panelTitleClass}>Entrar na plataforma</h2>
            </div>
          </div>

          {notification ? (
            <div className={noticeClass[notification.type]}>{notification.text}</div>
          ) : null}

          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                className={inputClass}
                placeholder="usuario@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="login-password" className="text-sm font-medium text-slate-700">
                Senha
              </label>
              <input
                id="login-password"
                type="password"
                value={loginForm.senha}
                onChange={(event) =>
                  setLoginForm((current) => ({
                    ...current,
                    senha: event.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Informe sua senha"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className={`${primaryButtonClass} flex-1`}
                disabled={authLoading}
              >
                {authLoading ? 'Autenticando...' : 'Entrar'}
              </button>
              <button
                type="button"
                className={`${secondaryButtonClass} flex-1`}
                onClick={onOpenCreateUser}
              >
                Criar usuario
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

export default LoginView
