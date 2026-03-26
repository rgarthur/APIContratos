import { startTransition, useEffect, useEffectEvent, useState } from 'react'
import Modal from './components/Modal'
import LoginView from './components/LoginView'
import DashboardSection from './components/DashboardSection'
import UsersSection from './components/UsersSection'
import ClientsSection from './components/ClientsSection'
import ContractsSection from './components/ContractsSection'
import FilesSection from './components/FilesSection'
import { API_BASE_URL, apiList, apiRequest } from './services/api'
import { clearSession, getStoredSession, saveSession } from './utils/auth'
import {
  ghostButtonClass,
  inputClass,
  kickerClass,
  noticeClass,
  panelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from './components/ui'
import {
  PRODUCT_OPTIONS,
  formatProductName,
  normalizeProductName,
} from './utils/contracts'

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', hint: 'Visao geral da operacao' },
  { id: 'usuarios', label: 'Usuarios', hint: 'Acesso, cadastro e conta' },
  { id: 'clientes', label: 'Clientes', hint: 'Cadastro e manutencao' },
  { id: 'contratos', label: 'Contratos', hint: 'Consulta e atualizacao' },
  { id: 'arquivos', label: 'Arquivos', hint: 'Importacao e historico' },
]

function App() {
  const [session, setSession] = useState(() => getStoredSession())
  const [activeModule, setActiveModule] = useState('dashboard')
  const [notification, setNotification] = useState(null)
  const [loadingModule, setLoadingModule] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [createUserOpen, setCreateUserOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', senha: '' })
  const [registerForm, setRegisterForm] = useState({
    nome: '',
    email: '',
    senha: '',
  })
  const [userForm, setUserForm] = useState({ id: '', nome: '', email: '' })
  const [userDeleteId, setUserDeleteId] = useState('')
  const [clients, setClients] = useState([])
  const [clientFilters, setClientFilters] = useState({ nome: '', cpf: '' })
  const [clientModalOpen, setClientModalOpen] = useState(false)
  const [clientModalLoading, setClientModalLoading] = useState(false)
  const [clientForm, setClientForm] = useState({ nome: '', cpf: '' })
  const [editingClientId, setEditingClientId] = useState('')
  const [contracts, setContracts] = useState([])
  const [contractFilters, setContractFilters] = useState({
    numContrato: '',
    idCliente: '',
    nomeCliente: '',
    cpfCliente: '',
    produto: '',
    vencimento: '',
    arquivoId: '',
  })
  const [contractModalOpen, setContractModalOpen] = useState(false)
  const [contractModalLoading, setContractModalLoading] = useState(false)
  const [contractForm, setContractForm] = useState({
    id: '',
    produto: '',
    valor: '',
    dataVencimento: '',
  })
  const [files, setFiles] = useState([])
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadLoading, setUploadLoading] = useState(false)

  useEffect(() => {
    if (!session.user) {
      setUserForm({ id: '', nome: '', email: '' })
      setUserDeleteId('')
      return
    }

    setUserForm({
      id: String(session.user.id ?? ''),
      nome: session.user.name ?? '',
      email: session.user.email ?? '',
    })
    setUserDeleteId(String(session.user.id ?? ''))
  }, [session.user])

  function showNotification(type, text) {
    setNotification({ type, text })
  }

  function changeModule(moduleId) {
    startTransition(() => setActiveModule(moduleId))
  }

  async function loadClients(filters = clientFilters) {
    const data = await apiList('/clientes', {
      token: session.token,
      query: { Nome: filters.nome, Cpf: filters.cpf },
    })
    setClients(data)
    return data
  }

  async function loadContracts(filters = contractFilters) {
    const data = await apiList('/contratos', {
      token: session.token,
      query: {
        NumContrato: filters.numContrato,
        IdCliente: filters.idCliente,
        NomeCliente: filters.nomeCliente,
        CpfCliente: filters.cpfCliente,
        Produto: filters.produto,
        Vencimento: filters.vencimento,
        ArquivoId: filters.arquivoId,
      },
    })
    setContracts(data)
    return data
  }

  async function loadFiles() {
    const data = await apiList('/arquivos', { token: session.token })
    setFiles(data)
    return data
  }

  async function loadModuleData(moduleId) {
    setLoadingModule(true)

    try {
      if (moduleId === 'dashboard') {
        await Promise.all([loadClients(), loadContracts(), loadFiles()])
      }
      if (moduleId === 'clientes') await loadClients()
      if (moduleId === 'contratos') await loadContracts()
      if (moduleId === 'arquivos') await loadFiles()
    } catch (error) {
      showNotification('error', error.message)
    } finally {
      setLoadingModule(false)
    }
  }

  const handleModuleLoad = useEffectEvent(async (moduleId) => {
    await loadModuleData(moduleId)
  })

  useEffect(() => {
    if (session.token) {
      handleModuleLoad(activeModule)
    }
  }, [activeModule, session.token])

  async function handleLogin(event) {
    event.preventDefault()
    setAuthLoading(true)

    try {
      const response = await apiRequest('/usuarios/login', {
        method: 'POST',
        body: loginForm,
      })

      setSession(saveSession(response.token))
      setLoginForm({ email: '', senha: '' })
      setActiveModule('dashboard')
      showNotification('success', 'Autenticacao concluida com sucesso.')
    } catch (error) {
      showNotification('error', error.message)
    } finally {
      setAuthLoading(false)
    }
  }

  async function handleRegisterUser(event) {
    event.preventDefault()
    setRegisterLoading(true)

    try {
      await apiRequest('/usuarios/registrar', {
        method: 'POST',
        body: registerForm,
      })

      setRegisterForm({ nome: '', email: '', senha: '' })
      setCreateUserOpen(false)
      showNotification('success', 'Usuario criado com sucesso.')
    } catch (error) {
      showNotification('error', error.message)
    } finally {
      setRegisterLoading(false)
    }
  }

  async function handleUpdateUser(event) {
    event.preventDefault()

    try {
      const response = await apiRequest(`/usuarios/${userForm.id}`, {
        method: 'PUT',
        token: session.token,
        body: { nome: userForm.nome, email: userForm.email },
      })

      if (String(response.id) === String(session.user?.id)) {
        setSession((current) => ({
          ...current,
          user: {
            ...current.user,
            name: response.nome ?? userForm.nome,
            email: response.email ?? userForm.email,
          },
        }))
      }

      showNotification('success', 'Usuario atualizado.')
    } catch (error) {
      showNotification('error', error.message)
    }
  }

  async function handleDeleteUser() {
    if (!userDeleteId) {
      showNotification('error', 'Informe o ID do usuario para exclusao.')
      return
    }

    try {
      await apiRequest(`/usuarios/${userDeleteId}`, {
        method: 'DELETE',
        token: session.token,
      })

      showNotification('success', 'Usuario excluido com sucesso.')

      if (String(userDeleteId) === String(session.user?.id)) {
        handleLogout()
      }
    } catch (error) {
      showNotification('error', error.message)
    }
  }

  function openClientModal(client = null) {
    if (client) {
      setEditingClientId(String(client.id))
      setClientForm({
        nome: client.nome ?? '',
        cpf: client.cpf ?? '',
      })
    } else {
      setEditingClientId('')
      setClientForm({ nome: '', cpf: '' })
    }

    setClientModalOpen(true)
  }

  async function handleSaveClient(event) {
    event.preventDefault()
    setClientModalLoading(true)

    try {
      if (editingClientId) {
        await apiRequest(`/clientes/${editingClientId}`, {
          method: 'PUT',
          token: session.token,
          body: clientForm,
        })
        showNotification('success', 'Cliente atualizado.')
      } else {
        await apiRequest('/clientes', {
          method: 'POST',
          token: session.token,
          body: clientForm,
        })
        showNotification('success', 'Cliente cadastrado.')
      }

      await loadClients()
      setClientModalOpen(false)
    } catch (error) {
      showNotification('error', error.message)
    } finally {
      setClientModalLoading(false)
    }
  }

  async function handleDeleteClient(id) {
    try {
      await apiRequest(`/clientes/${id}`, {
        method: 'DELETE',
        token: session.token,
      })
      await loadClients()
      showNotification('success', 'Cliente removido.')
    } catch (error) {
      showNotification('error', error.message)
    }
  }

  async function handleClientFilterSubmit(event) {
    event.preventDefault()

    try {
      await loadClients()
      showNotification('success', 'Lista de clientes atualizada.')
    } catch (error) {
      showNotification('error', error.message)
    }
  }

  function openContractModal(contract) {
    setContractForm({
      id: String(contract.id ?? ''),
      produto: normalizeProductName(contract.produto),
      valor:
        typeof contract.valor === 'number'
          ? String(contract.valor).replace('.', ',')
          : '',
      dataVencimento: contract.dataVencimento
        ? String(contract.dataVencimento).slice(0, 10)
        : '',
    })
    setContractModalOpen(true)
  }

  async function handleSaveContract(event) {
    event.preventDefault()
    setContractModalLoading(true)

    try {
      await apiRequest(`/contratos/${contractForm.id}`, {
        method: 'PUT',
        token: session.token,
        body: {
          produto: contractForm.produto || null,
          valor: contractForm.valor
            ? Number(contractForm.valor.replace(',', '.'))
            : null,
          dataVencimento: contractForm.dataVencimento || null,
        },
      })

      await loadContracts()
      setContractModalOpen(false)
      showNotification('success', 'Contrato atualizado.')
    } catch (error) {
      showNotification('error', error.message)
    } finally {
      setContractModalLoading(false)
    }
  }

  async function handleDeleteContract(id) {
    try {
      await apiRequest(`/contratos/${id}`, {
        method: 'DELETE',
        token: session.token,
      })
      await loadContracts()
      showNotification('success', 'Contrato excluido.')
    } catch (error) {
      showNotification('error', error.message)
    }
  }

  async function handleContractFilterSubmit(event) {
    event.preventDefault()

    try {
      await loadContracts()
      showNotification('success', 'Consulta de contratos atualizada.')
    } catch (error) {
      showNotification('error', error.message)
    }
  }

  async function handleUploadFile(event) {
    event.preventDefault()

    if (!uploadFile) {
      showNotification('error', 'Selecione um arquivo CSV para importar.')
      return
    }

    setUploadLoading(true)

    try {
      const formData = new FormData()
      formData.append('arquivo', uploadFile)

      await apiRequest('/arquivos/importar', {
        method: 'POST',
        token: session.token,
        body: formData,
      })

      setUploadFile(null)
      await Promise.all([loadFiles(), loadContracts(), loadClients()])
      showNotification('success', 'Arquivo processado e base atualizada.')
    } catch (error) {
      showNotification('error', error.message)
    } finally {
      setUploadLoading(false)
    }
  }

  async function handleDeleteFile(id) {
    try {
      await apiRequest(`/arquivos/${id}`, {
        method: 'DELETE',
        token: session.token,
      })
      await loadFiles()
      showNotification('success', 'Arquivo removido do historico.')
    } catch (error) {
      showNotification('error', error.message)
    }
  }

  function handleLogout() {
    clearSession()
    setSession({ token: '', user: null })
    setActiveModule('dashboard')
    setClients([])
    setContracts([])
    setFiles([])
    showNotification('success', 'Sessao encerrada.')
  }

  function closeClientModal() {
    setClientModalOpen(false)
    setEditingClientId('')
  }

  function closeContractModal() {
    setContractModalOpen(false)
    setContractForm({
      id: '',
      produto: '',
      valor: '',
      dataVencimento: '',
    })
  }

  function formatCurrency(value) {
    if (value === undefined || value === null || value === '') {
      return '-'
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(value))
  }

  function formatDate(value) {
    if (!value) {
      return '-'
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return String(value)
    }

    return date.toLocaleDateString('pt-BR')
  }

  function renderModule() {
    if (activeModule === 'usuarios') {
      return (
        <UsersSection
          sessionUser={session.user}
          userForm={userForm}
          setUserForm={setUserForm}
          userDeleteId={userDeleteId}
          setUserDeleteId={setUserDeleteId}
          onSubmitUpdate={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
          onOpenCreateUser={() => setCreateUserOpen(true)}
        />
      )
    }

    if (activeModule === 'clientes') {
      return (
        <ClientsSection
          clientFilters={clientFilters}
          setClientFilters={setClientFilters}
          onFilterSubmit={handleClientFilterSubmit}
          clients={clients}
          onOpenClientModal={openClientModal}
          onDeleteClient={handleDeleteClient}
        />
      )
    }

    if (activeModule === 'contratos') {
      return (
        <ContractsSection
          contractFilters={contractFilters}
          setContractFilters={setContractFilters}
          onFilterSubmit={handleContractFilterSubmit}
          contracts={contracts}
          onOpenContractModal={openContractModal}
          onDeleteContract={handleDeleteContract}
          onGoToFiles={() => changeModule('arquivos')}
          productOptions={PRODUCT_OPTIONS}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          formatProduct={formatProductName}
        />
      )
    }

    if (activeModule === 'arquivos') {
      return (
        <FilesSection
          uploadFile={uploadFile}
          setUploadFile={setUploadFile}
          uploadLoading={uploadLoading}
          onUpload={handleUploadFile}
          files={files}
          onDeleteFile={handleDeleteFile}
          formatDate={formatDate}
        />
      )
    }

    return (
      <DashboardSection
        clientsCount={clients.length}
        contractsCount={contracts.length}
        filesCount={files.length}
        apiBaseUrl={API_BASE_URL}
        onOpenCreateUser={() => setCreateUserOpen(true)}
        onChangeModule={changeModule}
      />
    )
  }

  if (!session.token) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <LoginView
          notification={notification}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          authLoading={authLoading}
          onSubmit={handleLogin}
          onOpenCreateUser={() => setCreateUserOpen(true)}
        />

        <Modal
          open={createUserOpen}
          title="Criar usuario"
          subtitle="Cadastro inicial para acesso a plataforma."
          onClose={() => setCreateUserOpen(false)}
        >
          <form className="space-y-4" onSubmit={handleRegisterUser}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="register-name" className="text-sm font-medium text-slate-700">
                  Nome
                </label>
                <input
                  id="register-name"
                  value={registerForm.nome}
                  onChange={(event) =>
                    setRegisterForm((current) => ({
                      ...current,
                      nome: event.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="register-email" className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  value={registerForm.email}
                  onChange={(event) =>
                    setRegisterForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder="novo.usuario@empresa.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="register-password" className="text-sm font-medium text-slate-700">
                Senha
              </label>
              <input
                id="register-password"
                type="password"
                value={registerForm.senha}
                onChange={(event) =>
                  setRegisterForm((current) => ({
                    ...current,
                    senha: event.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Defina a senha"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className={primaryButtonClass}
                disabled={registerLoading}
              >
                {registerLoading ? 'Salvando...' : 'Cadastrar usuario'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-slate-50 p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-sm font-semibold text-blue-700">
              AC
            </span>
            <div>
              <strong className="block text-base font-semibold text-slate-900">
                API Contratos
              </strong>
              <span className="block text-sm leading-6 text-slate-500">
                Front comercial operacional
              </span>
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            {MENU_ITEMS.map((item) => {
              const active = activeModule === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => changeModule(item.id)}
                  className={`block w-full rounded-xl border px-4 py-3 text-left transition ${
                    active
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-transparent bg-transparent hover:border-slate-200 hover:bg-white'
                  }`}
                >
                  <strong className="block text-sm font-semibold text-slate-900">
                    {item.label}
                  </strong>
                  <span className="mt-1 block text-sm leading-6 text-slate-500">
                    {item.hint}
                  </span>
                </button>
              )
            })}
          </nav>

          <div className={`${panelClass} mt-6 p-4`}>
            <span className={kickerClass}>Conectado em</span>
            <strong className="mt-2 block text-sm font-semibold text-slate-900">
              {session.user?.name || '-'}
            </strong>
            <span className="mt-1 block text-sm leading-6 text-slate-500">
              {session.user?.email || '-'}
            </span>
          </div>
        </aside>

        <div className="space-y-4 p-4 md:p-5">
          <header className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p className={kickerClass}>Modulo ativo</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                {MENU_ITEMS.find((item) => item.id === activeModule)?.label || 'Dashboard'}
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className={secondaryButtonClass}
                onClick={() => setCreateUserOpen(true)}
              >
                Novo usuario
              </button>
              <button type="button" className={ghostButtonClass} onClick={handleLogout}>
                Sair
              </button>
            </div>
          </header>

          {notification ? (
            <div className={noticeClass[notification.type]}>{notification.text}</div>
          ) : null}

          {loadingModule ? (
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              Atualizando dados...
            </div>
          ) : null}

          <main>{renderModule()}</main>
        </div>
      </div>

      <Modal
        open={createUserOpen}
        title="Criar usuario"
        subtitle="Cadastro simples vinculado ao endpoint /api/usuarios/registrar."
        onClose={() => setCreateUserOpen(false)}
      >
        <form className="space-y-4" onSubmit={handleRegisterUser}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="modal-register-name" className="text-sm font-medium text-slate-700">
                Nome
              </label>
              <input
                id="modal-register-name"
                value={registerForm.nome}
                onChange={(event) =>
                  setRegisterForm((current) => ({
                    ...current,
                    nome: event.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="modal-register-email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="modal-register-email"
                type="email"
                value={registerForm.email}
                onChange={(event) =>
                  setRegisterForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                className={inputClass}
                placeholder="usuario@empresa.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="modal-register-password" className="text-sm font-medium text-slate-700">
              Senha
            </label>
            <input
              id="modal-register-password"
              type="password"
              value={registerForm.senha}
              onChange={(event) =>
                setRegisterForm((current) => ({
                  ...current,
                  senha: event.target.value,
                }))
              }
              className={inputClass}
              placeholder="Senha inicial"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className={primaryButtonClass}
              disabled={registerLoading}
            >
              {registerLoading ? 'Salvando...' : 'Cadastrar usuario'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={clientModalOpen}
        title={editingClientId ? 'Editar cliente' : 'Novo cliente'}
        subtitle="Operacao conectada ao controller de clientes."
        onClose={closeClientModal}
      >
        <form className="space-y-4" onSubmit={handleSaveClient}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="client-name" className="text-sm font-medium text-slate-700">
                Nome
              </label>
              <input
                id="client-name"
                value={clientForm.nome}
                onChange={(event) =>
                  setClientForm((current) => ({
                    ...current,
                    nome: event.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Nome do cliente"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="client-cpf" className="text-sm font-medium text-slate-700">
                CPF
              </label>
              <input
                id="client-cpf"
                value={clientForm.cpf}
                onChange={(event) =>
                  setClientForm((current) => ({
                    ...current,
                    cpf: event.target.value,
                  }))
                }
                className={inputClass}
                placeholder="00000000000"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className={primaryButtonClass}
              disabled={clientModalLoading}
            >
              {clientModalLoading ? 'Salvando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={contractModalOpen}
        title="Editar contrato"
        subtitle="A API aceita atualizacao de produto, valor e vencimento."
        onClose={closeContractModal}
      >
        <form className="space-y-4" onSubmit={handleSaveContract}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="contract-edit-id" className="text-sm font-medium text-slate-700">
                ID
              </label>
              <input id="contract-edit-id" value={contractForm.id} readOnly className={inputClass} />
            </div>
            <div className="space-y-2">
              <label htmlFor="contract-edit-product" className="text-sm font-medium text-slate-700">
                Produto
              </label>
              <select
                id="contract-edit-product"
                value={contractForm.produto}
                onChange={(event) =>
                  setContractForm((current) => ({
                    ...current,
                    produto: event.target.value,
                  }))
                }
                className={inputClass}
              >
                <option value="">Selecione</option>
                {PRODUCT_OPTIONS.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="contract-edit-value" className="text-sm font-medium text-slate-700">
                Valor
              </label>
              <input
                id="contract-edit-value"
                value={contractForm.valor}
                onChange={(event) =>
                  setContractForm((current) => ({
                    ...current,
                    valor: event.target.value,
                  }))
                }
                className={inputClass}
                placeholder="0,00"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="contract-edit-date" className="text-sm font-medium text-slate-700">
                Vencimento
              </label>
              <input
                id="contract-edit-date"
                type="date"
                value={contractForm.dataVencimento}
                onChange={(event) =>
                  setContractForm((current) => ({
                    ...current,
                    dataVencimento: event.target.value,
                  }))
                }
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className={primaryButtonClass}
              disabled={contractModalLoading}
            >
              {contractModalLoading ? 'Salvando...' : 'Atualizar contrato'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default App
