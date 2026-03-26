using APIContratos.Data;
using APIContratos.DTOs.ContratoDTOs;
using APIContratos.Interfaces;
using APIContratos.Models;

namespace APIContratos.Services
{
    public class ArquivoService : IArquivoService
    {
        private readonly AppDbContext _context;

        public ArquivoService(AppDbContext context)
        {
            _context = context;

        }


        public IEnumerable<ContratoDTO> ProcessarPlanilha(IFormFile arquivo)
        {
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
            }
            return listaContratos;
        }

        public IEnumerable<Arquivo> ObterHistoricoArquivos()
        {
            return _context.Arquivos
                           .OrderByDescending(a => a.Data)
                           .Where(v => v.Valido)
                           .ToList();
        }
        public void ArquivoJaExiste(IFormFile arquivo)
        {
            var caminhoCompleto = Path.Combine("Storage", arquivo.FileName);
            bool arquivoJaExisteBanco = _context.Arquivos.Any(c => c.Caminho == caminhoCompleto);
            bool arquivoJaExisteNoServer = File.Exists(caminhoCompleto);
            if (arquivoJaExisteNoServer && arquivoJaExisteBanco)
                throw new Exception("Arquivo ja importado anteriormente");
        }

        public Arquivo SalvarArquivo(IFormFile arquivo, int idUsuario)
        {
            var caminho = Path.Combine("Storage", arquivo.FileName);

            using Stream fileStream = new FileStream(caminho, FileMode.Create);
            arquivo.CopyTo(fileStream);

            Arquivo novoArquivo = new Arquivo()
            {
                Caminho = caminho,
                Data = DateTime.Now,
                IdUsuario = idUsuario
            };

            _context.Add(novoArquivo);
            return novoArquivo;
        }

        public void ExcluirArquivo(int id)
        {
            var arquivo = _context.Arquivos.Find(id);

            if (arquivo == null || !arquivo.Valido)
            {
                throw new Exception("Arquivo não encontrado para exclusão.");
            }

            arquivo.Valido = false;

            _context.SaveChanges();
        }
    }
}
