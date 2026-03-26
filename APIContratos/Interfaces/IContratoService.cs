using APIContratos.Models;
using Microsoft.AspNetCore.Http;
using APIContratos.DTOs.ContratoDTOs;

namespace APIContratos.Interfaces
{
    public interface IContratoService
    {
        IEnumerable<Contrato> VisualizarContratos(ContratoFiltroDTO filtro);
        Contrato AtualizarContrato(int id, ContratoUpdateDTO dadosAtualizados);
        void ExcluirContrato(int id);
        void AdicionarBulkContratos(IEnumerable<Contrato> novosContratos);
    }
}
