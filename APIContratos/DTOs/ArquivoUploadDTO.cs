using Microsoft.AspNetCore.Http;

namespace APIContratos.DTOs
{
    public class ArquivoUploadDto
    {
        public IFormFile Arquivo { get; set; }
    }
}