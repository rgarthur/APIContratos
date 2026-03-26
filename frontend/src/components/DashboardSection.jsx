import StatCard from './StatCard'
import {
  headingRowClass,
  kickerClass,
  panelClass,
  panelTitleClass,
  pillClass,
} from './ui'

function DashboardSection({
  clientsCount,
  contractsCount,
  filesCount,
  apiBaseUrl,
  onOpenCreateUser,
  onChangeModule,
}) {
  return (
    <div className="space-y-4">
      <section className={`${panelClass} grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,1fr)]`}>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className={kickerClass}>Painel comercial</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Bem-vindo ao painel operacional
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600">
              Acompanhe os numeros principais e acesse rapidamente os modulos mais
              usados da plataforma.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={pillClass}>Clientes</span>
            <span className={pillClass}>Contratos</span>
            <span className={pillClass}>Arquivos</span>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
          <StatCard
            label="Clientes ativos"
            value={clientsCount}
            hint="Base consultada a partir do controller de clientes."
          />
          <StatCard
            label="Contratos ativos"
            value={contractsCount}
            hint="Consulta refletindo o retorno do controller de contratos."
          />
          <StatCard
            label="Arquivos importados"
            value={filesCount}
            hint="Historico de cargas processadas pela API."
          />
        </div>
      </section>

      <section className={`${panelClass} space-y-5`}>
        <div className={headingRowClass}>
          <div className="space-y-2">
            <p className={kickerClass}>Acoes rapidas</p>
            <h2 className={panelTitleClass}>Atalhos para a operacao diaria</h2>
          </div>
          <span className={pillClass}>API {apiBaseUrl}</span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50"
            onClick={onOpenCreateUser}
          >
            <strong className="block text-sm font-semibold text-slate-900">
              Novo usuario
            </strong>
            <span className="mt-2 block text-sm leading-6 text-slate-600">
              Abre o modal de cadastro para liberar acesso.
            </span>
          </button>
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50"
            onClick={() => onChangeModule('clientes')}
          >
            <strong className="block text-sm font-semibold text-slate-900">
              Gerenciar clientes
            </strong>
            <span className="mt-2 block text-sm leading-6 text-slate-600">
              Listagem, cadastro, edicao e exclusao logica.
            </span>
          </button>
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50"
            onClick={() => onChangeModule('contratos')}
          >
            <strong className="block text-sm font-semibold text-slate-900">
              Atualizar contratos
            </strong>
            <span className="mt-2 block text-sm leading-6 text-slate-600">
              Consulta detalhada e ajustes em lote operacional.
            </span>
          </button>
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50"
            onClick={() => onChangeModule('arquivos')}
          >
            <strong className="block text-sm font-semibold text-slate-900">
              Importar planilha
            </strong>
            <span className="mt-2 block text-sm leading-6 text-slate-600">
              Fluxo de criacao de contratos e clientes via CSV.
            </span>
          </button>
        </div>
      </section>
    </div>
  )
}

export default DashboardSection
