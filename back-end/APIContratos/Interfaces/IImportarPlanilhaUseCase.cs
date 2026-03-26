namespace APIContratos.Interfaces
{
    public interface IImportarPlanilhaUseCase
    {
        void Processar(IFormFile arquivo, int idUsuario);
    }
}
