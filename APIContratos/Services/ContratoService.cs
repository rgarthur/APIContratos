using APIContratos.Data;
using APIContratos.DTOs;
using APIContratos.Interfaces;
using APIContratos.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace APIContratos.Services
{
    public class ContratoService : IContratoService
    {
        private readonly AppDbContext _context;

        public ContratoService(AppDbContext context)
        {
            _context = context;
        }

        public void ProcessarPlanilha(IFormFile arquivo)
        {
            var usuarioPadrao = _context.Usuarios.FirstOrDefault();

            if (usuarioPadrao == null)
            {
                usuarioPadrao = new Usuario()
                {
                    Nome = "Sistema Admin",
                    Email = "admin@sistema.com",
                    SenhaHash = "123456" 
                };
                _context.Usuarios.Add(usuarioPadrao);
                _context.SaveChanges();
            }

            Arquivo novoArquivo = new Arquivo()
            {
                Caminho = arquivo.FileName,
                Data = DateTime.Now,
                IdUsuario = usuarioPadrao.Id
                
            };

            _context.Arquivos.Add(novoArquivo);

            List<ContratoDTO> listaContratos = new List<ContratoDTO>();
            using (StreamReader reader = new StreamReader(arquivo.OpenReadStream()))
            {
                string linha, linhaCabecalho;
                linhaCabecalho = reader.ReadLine();
                string[] cabecalhos = linhaCabecalho.Split(";");
                cabecalhos = cabecalhos.Select(c => c.ToLower().Trim()).ToArray();
                int indiceCpf, indiceNome, indiceNumContrato, indiceProduto, indiceValor, indiceVencimento;
                indiceNome = Array.IndexOf(cabecalhos, "nome");
                indiceCpf = Array.IndexOf(cabecalhos, "cpf");
                indiceNumContrato = Array.IndexOf(cabecalhos, "contrato");
                indiceProduto = Array.IndexOf(cabecalhos, "produto");
                indiceValor = Array.IndexOf(cabecalhos, "valor");
                indiceVencimento = Array.IndexOf(cabecalhos, "vencimento");

                while ((linha = reader.ReadLine()) != null)
                {
                    string[] colunas = linha.Split(";");
                    string nomeCliente = colunas[indiceNome];
                    string CPFCliente = colunas[indiceCpf];
                    string numContrato = colunas[indiceNumContrato];
                    string produto = colunas[indiceProduto];
                    string valor = colunas[indiceValor];
                    string vencimento = colunas[indiceVencimento];

                    ContratoDTO linhaAtual = new ContratoDTO()
                    {
                        NomeCliente = nomeCliente,
                        CpfCliente = CPFCliente,
                        NumContrato = numContrato,
                        Produto = produto,
                        Valor = valor,
                        Vencimento = vencimento
                    };

                    listaContratos.Add(linhaAtual);
                }

                string[] cpfsNaPlanilha = listaContratos.Select(dto => dto.CpfCliente).ToArray();

                List<Cliente> clientesExistentes = _context.Clientes
                    .Where(c => cpfsNaPlanilha.Contains(c.Cpf))
                    .ToList();

                foreach (ContratoDTO item in listaContratos)
                {
                    Cliente clienteExistente = clientesExistentes.FirstOrDefault(c => c.Cpf == item.CpfCliente);

                    Cliente clienteParaOContrato;

                    if (clienteExistente != null)
                    {
                        clienteParaOContrato = clienteExistente;
                    }
                    else
                    {
                        clienteParaOContrato = new Cliente()
                        {
                            Nome = item.NomeCliente,
                            Cpf = item.CpfCliente
                        };

                        _context.Clientes.Add(clienteParaOContrato);
                        clientesExistentes.Add(clienteParaOContrato);
                    }

                    Contrato novoContrato = new Contrato()
                    {
                        NumeroContrato = int.Parse(item.NumContrato),
                        Produto = TradutorProduto(item.Produto),
                        Valor = decimal.Parse(item.Valor),
                        DataVencimento = DateTime.Parse(item.Vencimento),
                        Cliente = clienteParaOContrato,
                        Upload = novoArquivo,
                    };

                    _context.Contratos.Add(novoContrato);
                }
                _context.SaveChanges();
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

        public IEnumerable<Contrato> VisualizarContratos(ContratoFiltroDTO filtro)
        {
            var query = _context.Contratos.Include(c => c.Cliente).Where(c => c.Ativo && c.Cliente.Valido).AsQueryable();

            if (filtro.NumContrato.HasValue) query = query.Where(c => c.NumeroContrato == filtro.NumContrato.Value);
            if (filtro.IdCliente.HasValue) query = query.Where(c => c.ClienteId == filtro.IdCliente.Value);
            if (!string.IsNullOrWhiteSpace(filtro.CpfCliente)) query = query.Where(c => c.Cliente.Cpf == filtro.CpfCliente);
            if (!string.IsNullOrWhiteSpace(filtro.NomeCliente)) query = query.Where(c => c.Cliente.Nome.Contains(filtro.NomeCliente));
            if (filtro.Produto.HasValue) query = query.Where(c => c.Produto == filtro.Produto.Value);
            if (filtro.Vencimento.HasValue) query = query.Where(c => c.DataVencimento.Date == filtro.Vencimento.Value.Date);
            if (filtro.ArquivoId.HasValue) query = query.Where(c => c.IdArquivo == filtro.ArquivoId.Value);

            return query.ToList();
        }

        public Contrato AtualizarContrato(int id, ContratoUpdateDTO dadosAtualizados)
        {
            var contrato = _context.Contratos.Find(id);

            if (contrato == null)
            {
                throw new Exception("Contrato não encontrado no banco de dados.");
            }

            if (dadosAtualizados.Produto.HasValue)
                contrato.Produto = dadosAtualizados.Produto.Value;

            if (dadosAtualizados.Valor.HasValue)
                contrato.Valor = dadosAtualizados.Valor.Value;

            if (dadosAtualizados.DataVencimento.HasValue)
                contrato.DataVencimento = dadosAtualizados.DataVencimento.Value;

            _context.SaveChanges();

            return contrato;
        }
        public void ExcluirContrato(int id)
        {
            var contrato = _context.Contratos.Find(id);

            if (contrato == null)
            {
                throw new Exception("Contrato não encontrado para exclusão.");
            }

            contrato.Ativo = false;

            _context.SaveChanges();
        }
    }
}