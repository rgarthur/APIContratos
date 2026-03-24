using APIContratos.Models;
using Microsoft.AspNetCore.Http;
using APIContratos.DTOs;

namespace APIContratos.Interfaces
{
    public interface IContratoService
    {
        void ProcessarPlanilha(IFormFile arquivo);
        IEnumerable<Contrato> VisualizarContratos(ContratoFiltroDTO filtro);
        Contrato AtualizarContrato(int id, ContratoUpdateDTO dadosAtualizados);
        void ExcluirContrato(int id);
    }
}
