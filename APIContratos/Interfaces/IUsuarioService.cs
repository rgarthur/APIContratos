using APIContratos.DTOs.ClienteDTOs;
using APIContratos.DTOs.UsuarioDTOs;
using APIContratos.Models;

namespace APIContratos.Interfaces
{
    public interface IUsuarioService
    {
        Usuario Registrar(UsuarioRegistroDTO dto);
        string Autenticar(UsuarioLoginDTO dto);
        Usuario AtualizarUsuario(int id, UsuarioUpdateDTO dadosAtualizados);
        void ExcluirUsuario(int id);
    }
}
