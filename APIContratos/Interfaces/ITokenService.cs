using APIContratos.Models;

namespace APIContratos.Interfaces
{
    public interface ITokenService
    {
        string GerarToken(Usuario usuario);
    }
}
