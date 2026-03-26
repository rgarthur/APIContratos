using APIContratos.Data;
using APIContratos.DTOs.ContratoDTOs;
using APIContratos.Interfaces;
using APIContratos.Models;
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

        public void AdicionarBulkContratos(IEnumerable<Contrato> novosContratos)
        {
            if (novosContratos != null && novosContratos.Any())
            {
                _context.Contratos.AddRange(novosContratos);
            }
        }
    }
}