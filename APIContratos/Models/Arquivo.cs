namespace APIContratos.Models
{
    public class Arquivo
    {
        public int Id { get; set; }
        public int IdUsuario { get; set; }
        public DateTime Data { get; set; }
        public string Caminho { get; set; }
    }
}
