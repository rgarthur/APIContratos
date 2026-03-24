using APIContratos.Models;

namespace APIContratos.DTOs
{
    public class ContratoUpdateDTO
    {
        public Contrato.TipoProduto? Produto { get; set; }
        public decimal? Valor { get; set; }
        public DateTime? DataVencimento { get; set; }
    }
}
