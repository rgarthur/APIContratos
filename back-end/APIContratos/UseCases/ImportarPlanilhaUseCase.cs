using APIContratos.Interfaces;
using APIContratos.Models;

namespace APIContratos.UseCases
{
    public class ImportarPlanilhaUseCase : IImportarPlanilhaUseCase
    {
        private readonly IArquivoService _arquivoService;
        private readonly IClienteService _clienteService;
        private readonly IContratoService _contratoService;
        private readonly IUnitOfWork _unitOfWork;

        public ImportarPlanilhaUseCase(
            IArquivoService arquivoService,
            IClienteService clienteService,
            IContratoService contratoService,
            IUnitOfWork unitOfWork)
        {   
            _arquivoService = arquivoService;
            _clienteService = clienteService;
            _contratoService = contratoService;
            _unitOfWork = unitOfWork;
        }

        public void Processar(IFormFile arquivo)
        {
            _arquivoService.ArquivoJaExiste(arquivo);

            var planilhaProcessada = _arquivoService.ProcessarPlanilha(arquivo);
            string[] cpfsNaPlanilha = planilhaProcessada.Select(dto => dto.CpfCliente).Distinct().ToArray();
            var clientesExistentes = _clienteService.VerificarCPFs(cpfsNaPlanilha);

            List<Cliente> novosClientes = new List<Cliente>();
            List<Contrato> novosContratos = new List<Contrato>();

            Dictionary<string, Cliente> novosClientesCache = new Dictionary<string, Cliente>();

            Arquivo arquivoImportado = _arquivoService.SalvarArquivo(arquivo);

            foreach (var linhaAtual in planilhaProcessada)
            {
                Cliente clienteExistente = clientesExistentes.FirstOrDefault(c => c.Cpf == linhaAtual.CpfCliente);
                Cliente clienteParaOContrato;
               
                if (clienteExistente != null)
                {
                    clienteParaOContrato = clienteExistente;
                }
                else
                {
                    if (novosClientesCache.TryGetValue(linhaAtual.CpfCliente, out Cliente clienteCriadoNesteLoop))
                    {
                        clienteParaOContrato = clienteCriadoNesteLoop;
                    }
                    else
                    {
                        clienteParaOContrato = new Cliente()
                        {
                            Nome = linhaAtual.NomeCliente,
                            Cpf = linhaAtual.CpfCliente
                        };

                        novosClientes.Add(clienteParaOContrato);
                        novosClientesCache.Add(clienteParaOContrato.Cpf, clienteParaOContrato);
                    }
                }

                Contrato novoContrato = new Contrato()
                {
                    NumeroContrato = int.Parse(linhaAtual.NumContrato),
                    Produto = TradutorProduto(linhaAtual.Produto),
                    Valor = decimal.Parse(linhaAtual.Valor),
                    DataVencimento = DateTime.Parse(linhaAtual.Vencimento),
                    Cliente = clienteParaOContrato,
                    Upload = arquivoImportado
                };

                novosContratos.Add(novoContrato);
            }

            _clienteService.AdicionarBulkClientes(novosClientes);
            _contratoService.AdicionarBulkContratos(novosContratos);

            try
            {
                _unitOfWork.Commit();
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                var erroReal = ex.InnerException?.Message;
                throw;
            }
        }
        private Contrato.TipoProduto? TradutorProduto(string produtoPlanilha)
        {
            if (string.IsNullOrWhiteSpace(produtoPlanilha))
            {
                return null;
            }

            string p = produtoPlanilha.Trim().ToLower();

            if (p.Contains("imobili")) return Contrato.TipoProduto.FinanciamentoImobiliario;

            if (p.Contains("cart") || p.Contains("credito")) return Contrato.TipoProduto.CartaoDeCredito;

            if (p.Contains("pessoal")) return Contrato.TipoProduto.CreditoPessoal;

            if (p.Contains("finan") && p.Contains("culo")) return Contrato.TipoProduto.FinanciamentoVeiculo;

            if (p.Contains("cheque") || p.Contains("especial")) return Contrato.TipoProduto.ChequeEspecial;

            return null;
        }
    }
}
