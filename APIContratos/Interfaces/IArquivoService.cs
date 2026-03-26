using APIContratos.DTOs.ContratoDTOs;
using APIContratos.Models;

namespace APIContratos.Interfaces
{
    public interface IArquivoService
    {
        IEnumerable<ContratoDTO> ProcessarPlanilha(IFormFile arquivo);
        IEnumerable<Arquivo> ObterHistoricoArquivos();
        Arquivo SalvarArquivo(IFormFile arquivo);
        void ArquivoJaExiste(IFormFile nomeArquivo);
        void ExcluirArquivo(int id);
    }
}
