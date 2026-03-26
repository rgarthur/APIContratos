using Microsoft.EntityFrameworkCore;

namespace APIContratos.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Models.Contrato> Contratos { get; set; }

        public DbSet<Models.Arquivo> Arquivos { get; set; }

        public DbSet<Models.Cliente> Clientes { get; set; }

        public DbSet<Models.Usuario> Usuarios { get; set; }
    }
}
