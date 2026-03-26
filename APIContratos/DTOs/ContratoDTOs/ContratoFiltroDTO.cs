using APIContratos.Models;

namespace APIContratos.DTOs.ContratoDTOs
{
    public class ContratoFiltroDTO
    {
        public int? NumContrato { get; set; }
        public int? IdCliente { get; set; }
        public string? NomeCliente { get; set; }
        public string? CpfCliente { get; set; }
        public Contrato.TipoProduto? Produto { get; set; }
        public DateTime? Vencimento { get; set; }
        public int? ArquivoId { get; set; }
    }
}
