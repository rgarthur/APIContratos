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

        // Chaves Estrangeiras (FKs)
        public int IdArquivo { get; set; }
        public int ClienteId { get; set; }

        // Dados do Contrato
        public int NumeroContrato { get; set; }
        public TipoProduto Produto { get; set; }
        public DateTime DataVencimento { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Valor { get; set; }
        public Cliente Cliente { get; set; }
        public Arquivo Upload { get; set; }
    }
}