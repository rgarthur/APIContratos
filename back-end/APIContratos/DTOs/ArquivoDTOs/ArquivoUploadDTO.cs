namespace APIContratos.DTOs.ArquivoDTOs
{
    public class ArquivoUploadDto
    {
        public IFormFile Arquivo { get; set; }
        public int UsuarioId { get; set; }
    }
}