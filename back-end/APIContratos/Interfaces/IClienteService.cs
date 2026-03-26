using APIContratos.Controllers;
using APIContratos.DTOs.ClienteDTOs;
using APIContratos.Models;

namespace APIContratos.Interfaces
{
    public interface IClienteService
    {
        Cliente AdicionarCliente (AdicionarClienteDTO novoCliente);
        IEnumerable<Cliente> VisualizarClientes(ClienteFiltroDTO filtro);
        Cliente AtualizarCliente(int id, ClienteUpdateDTO dadosAtualizados);
        void ExcluirCliente(int id);
        IEnumerable<Cliente> VerificarCPFs(string[] cpfs);
        void AdicionarBulkClientes(IEnumerable<Cliente> novosClientes);

    }
}
