using System.ComponentModel.DataAnnotations.Schema;

namespace APIContratos.Models
{
    public class Contrato
    {
        public enum TipoProduto
        {
            FinanciamentoImobiliario,
            CartaoDeCredito,
            CreditoPessoal,
            FinanciamentoVeiculo,
            ChequeEspecial
        }

        public int Id { get; set; }
        public int IdArquivo { get; set; }
        public int ClienteId { get; set; }
        public int NumeroContrato { get; set; }
        public TipoProduto? Produto { get; set; }
        public DateTime DataVencimento { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Valor { get; set; }
        public Cliente Cliente { get; set; }
        [ForeignKey("IdArquivo")]
        public Arquivo Upload { get; set; }

        public bool Ativo { get; set; } = true;
    }
}