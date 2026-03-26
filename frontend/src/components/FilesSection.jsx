import {
  dangerButtonClass,
  headingRowClass,
  kickerClass,
  panelClass,
  panelTitleClass,
  primaryButtonClass,
  tableCellClass,
  tableHeadClass,
} from './ui'

function FilesSection({
  uploadFile,
  setUploadFile,
  uploadLoading,
  onUpload,
  files,
  onDeleteFile,
  formatDate,
}) {
  return (
    <div className="space-y-4">
      <section className={`${panelClass} space-y-5`}>
        <div className={headingRowClass}>
          <div className="space-y-2">
            <p className={kickerClass}>Arquivos</p>
            <h2 className={panelTitleClass}>Importacao de planilhas</h2>
          </div>
        </div>

        <form className="space-y-4" onSubmit={onUpload}>
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <span className={kickerClass}>CSV operacional</span>
            <h3 className="mt-2 text-lg font-semibold text-slate-950">
              Envie a planilha para criar clientes e contratos
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A API processa o arquivo e registra historico de importacao no mesmo
              fluxo.
            </p>
            <input
              type="file"
              accept=".csv"
              className="mt-4 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
              onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
            />
            <span className="mt-3 block text-sm text-slate-500">
              {uploadFile ? uploadFile.name : 'Nenhum arquivo selecionado'}
            </span>
          </div>
          <div>
            <button type="submit" className={primaryButtonClass} disabled={uploadLoading}>
              {uploadLoading ? 'Processando...' : 'Importar arquivo'}
            </button>
          </div>
        </form>
      </section>

      <section className={`${panelClass} space-y-5`}>
        <div className="space-y-2">
          <p className={kickerClass}>Historico</p>
          <h2 className={panelTitleClass}>{files.length} arquivos registrados</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className={tableHeadClass}>ID</th>
                <th className={tableHeadClass}>Data</th>
                <th className={tableHeadClass}>Caminho</th>
                <th className={tableHeadClass}>ID usuario</th>
                <th className={tableHeadClass}>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {files.length === 0 ? (
                <tr>
                  <td colSpan="5" className={`${tableCellClass} text-center text-slate-500`}>
                    Nenhum arquivo processado ate o momento.
                  </td>
                </tr>
              ) : (
                files.map((file) => (
                  <tr key={file.id}>
                    <td className={tableCellClass}>{file.id}</td>
                    <td className={tableCellClass}>{formatDate(file.data)}</td>
                    <td className={tableCellClass}>{file.caminho}</td>
                    <td className={tableCellClass}>{file.idUsuario || '-'}</td>
                    <td className={tableCellClass}>
                      <button
                        type="button"
                        className={dangerButtonClass}
                        onClick={() => onDeleteFile(file.id)}
                      >
                        Excluir
                      </button>
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

export default FilesSection
