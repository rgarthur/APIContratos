import {
  ghostButtonClass,
  headingRowClass,
  inputClass,
  kickerClass,
  panelClass,
  panelTitleClass,
  primaryButtonClass,
  tableCellClass,
  tableHeadClass,
  dangerButtonClass,
} from './ui'

function ClientsSection({
  clientFilters,
  setClientFilters,
  onFilterSubmit,
  clients,
  onOpenClientModal,
  onDeleteClient,
}) {
  return (
    <div className="space-y-4">
      <section className={`${panelClass} space-y-5`}>
        <div className={headingRowClass}>
          <div className="space-y-2">
            <p className={kickerClass}>Clientes</p>
            <h2 className={panelTitleClass}>Filtro operacional e cadastro</h2>
          </div>
          <button
            type="button"
            className={primaryButtonClass}
            onClick={() => onOpenClientModal()}
          >
            Novo cliente
          </button>
        </div>

        <form className="grid gap-4 md:grid-cols-3" onSubmit={onFilterSubmit}>
          <div className="space-y-2">
            <label htmlFor="client-filter-name" className="text-sm font-medium text-slate-700">
              Nome
            </label>
            <input
              id="client-filter-name"
              value={clientFilters.nome}
              onChange={(event) =>
                setClientFilters((current) => ({
                  ...current,
                  nome: event.target.value,
                }))
              }
              className={inputClass}
              placeholder="Pesquisar por nome"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="client-filter-cpf" className="text-sm font-medium text-slate-700">
              CPF
            </label>
            <input
              id="client-filter-cpf"
              value={clientFilters.cpf}
              onChange={(event) =>
                setClientFilters((current) => ({
                  ...current,
                  cpf: event.target.value,
                }))
              }
              className={inputClass}
              placeholder="00000000000"
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className={primaryButtonClass}>
              Aplicar filtros
            </button>
          </div>
        </form>
      </section>

      <section className={`${panelClass} space-y-5`}>
        <div className="space-y-2">
          <p className={kickerClass}>Base retornada</p>
          <h2 className={panelTitleClass}>{clients.length} clientes encontrados</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className={tableHeadClass}>ID</th>
                <th className={tableHeadClass}>Nome</th>
                <th className={tableHeadClass}>CPF</th>
                <th className={tableHeadClass}>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan="4" className={`${tableCellClass} text-center text-slate-500`}>
                    Nenhum cliente retornado com os filtros informados.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id}>
                    <td className={tableCellClass}>{client.id}</td>
                    <td className={tableCellClass}>{client.nome}</td>
                    <td className={tableCellClass}>{client.cpf}</td>
                    <td className={tableCellClass}>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className={ghostButtonClass}
                          onClick={() => onOpenClientModal(client)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className={dangerButtonClass}
                          onClick={() => onDeleteClient(client.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default ClientsSection
