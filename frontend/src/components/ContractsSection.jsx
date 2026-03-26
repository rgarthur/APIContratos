import {
  dangerButtonClass,
  ghostButtonClass,
  headingRowClass,
  inputClass,
  kickerClass,
  panelClass,
  panelTitleClass,
  primaryButtonClass,
  secondaryButtonClass,
  tableCellClass,
  tableHeadClass,
} from './ui'

function ContractsSection({
  contractFilters,
  setContractFilters,
  onFilterSubmit,
  contracts,
  onOpenContractModal,
  onDeleteContract,
  onGoToFiles,
  productOptions,
  formatCurrency,
  formatDate,
  formatProduct,
}) {
  return (
    <div className="space-y-4">
      <section className={`${panelClass} space-y-5`}>
        <div className={headingRowClass}>
          <div className="space-y-2">
            <p className={kickerClass}>Contratos</p>
            <h2 className={panelTitleClass}>Consulta e manutencao</h2>
          </div>
          <button type="button" className={secondaryButtonClass} onClick={onGoToFiles}>
            Ir para importacao
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          <strong className="block text-slate-800">Fluxo de criacao</strong>
          A API atual cria contratos por importacao de arquivo. Neste modulo ficam
          consulta, atualizacao e exclusao.
        </div>

        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={onFilterSubmit}>
          <div className="space-y-2">
            <label htmlFor="contract-numero" className="text-sm font-medium text-slate-700">
              Numero
            </label>
            <input
              id="contract-numero"
              value={contractFilters.numContrato}
              onChange={(event) =>
                setContractFilters((current) => ({
                  ...current,
                  numContrato: event.target.value,
                }))
              }
              className={inputClass}
              placeholder="Numero do contrato"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="contract-id-cliente" className="text-sm font-medium text-slate-700">
              ID do cliente
            </label>
            <input
              id="contract-id-cliente"
              value={contractFilters.idCliente}
              onChange={(event) =>
                setContractFilters((current) => ({
                  ...current,
                  idCliente: event.target.value,
                }))
              }
              className={inputClass}
              placeholder="ID do cliente"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="contract-nome" className="text-sm font-medium text-slate-700">
              Nome do cliente
            </label>
            <input
              id="contract-nome"
              value={contractFilters.nomeCliente}
              onChange={(event) =>
                setContractFilters((current) => ({
                  ...current,
                  nomeCliente: event.target.value,
                }))
              }
              className={inputClass}
              placeholder="Nome do cliente"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="contract-cpf" className="text-sm font-medium text-slate-700">
              CPF
            </label>
            <input
              id="contract-cpf"
              value={contractFilters.cpfCliente}
              onChange={(event) =>
                setContractFilters((current) => ({
                  ...current,
                  cpfCliente: event.target.value,
                }))
              }
              className={inputClass}
              placeholder="CPF do cliente"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="contract-produto" className="text-sm font-medium text-slate-700">
              Produto
            </label>
            <select
              id="contract-produto"
              value={contractFilters.produto}
              onChange={(event) =>
                setContractFilters((current) => ({
                  ...current,
                  produto: event.target.value,
                }))
              }
              className={inputClass}
            >
              <option value="">Todos</option>
              {productOptions.map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="contract-vencimento" className="text-sm font-medium text-slate-700">
              Vencimento
            </label>
            <input
              id="contract-vencimento"
              type="date"
              value={contractFilters.vencimento}
              onChange={(event) =>
                setContractFilters((current) => ({
                  ...current,
                  vencimento: event.target.value,
                }))
              }
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="contract-arquivo" className="text-sm font-medium text-slate-700">
              Arquivo
            </label>
            <input
              id="contract-arquivo"
              value={contractFilters.arquivoId}
              onChange={(event) =>
                setContractFilters((current) => ({
                  ...current,
                  arquivoId: event.target.value,
                }))
              }
              className={inputClass}
              placeholder="ID do arquivo"
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className={primaryButtonClass}>
              Consultar
            </button>
          </div>
        </form>
      </section>

      <section className={`${panelClass} space-y-5`}>
        <div className="space-y-2">
          <p className={kickerClass}>Carteira ativa</p>
          <h2 className={panelTitleClass}>{contracts.length} contratos encontrados</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className={tableHeadClass}>ID</th>
                <th className={tableHeadClass}>Numero</th>
                <th className={tableHeadClass}>Cliente</th>
                <th className={tableHeadClass}>Produto</th>
                <th className={tableHeadClass}>Valor</th>
                <th className={tableHeadClass}>Vencimento</th>
                <th className={tableHeadClass}>Arquivo</th>
                <th className={tableHeadClass}>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan="8" className={`${tableCellClass} text-center text-slate-500`}>
                    Nenhum contrato retornado com os filtros informados.
                  </td>
                </tr>
              ) : (
                contracts.map((contract) => (
                  <tr key={contract.id}>
                    <td className={tableCellClass}>{contract.id}</td>
                    <td className={tableCellClass}>{contract.numeroContrato}</td>
                    <td className={tableCellClass}>
                      <strong className="block font-semibold text-slate-900">
                        {contract.cliente?.nome ?? '-'}
                      </strong>
                      <span className="mt-1 block text-slate-500">
                        {contract.cliente?.cpf ?? '-'}
                      </span>
                    </td>
                    <td className={tableCellClass}>{formatProduct(contract.produto)}</td>
                    <td className={tableCellClass}>{formatCurrency(contract.valor)}</td>
                    <td className={tableCellClass}>{formatDate(contract.dataVencimento)}</td>
                    <td className={tableCellClass}>{contract.idArquivo}</td>
                    <td className={tableCellClass}>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className={ghostButtonClass}
                          onClick={() => onOpenContractModal(contract)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className={dangerButtonClass}
                          onClick={() => onDeleteContract(contract.id)}
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

export default ContractsSection
