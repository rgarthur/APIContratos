using APIContratos.Data;
using APIContratos.DTOs.UsuarioDTOs;
using APIContratos.Interfaces;
using APIContratos.Models;

namespace APIContratos.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly AppDbContext _context;
        private readonly ITokenService _tokenService;

        public UsuarioService(AppDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public Usuario Registrar(UsuarioRegistroDTO dto)
        {
            if (_context.Usuarios.Any(u => u.Email == dto.Email))
                throw new Exception("Email já cadastrado.");

            var novoUsuario = new Usuario
            {
                Nome = dto.Nome,
                Email = dto.Email,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha),
                Administrador = false, 
                Ativo = true
            };

            _context.Usuarios.Add(novoUsuario);
            _context.SaveChanges();

            return novoUsuario;
        }

        public string Autenticar(UsuarioLoginDTO dto)
        {
            var usuario = _context.Usuarios.SingleOrDefault(u => u.Email == dto.Email);

            if (usuario == null || !usuario.Ativo)
                throw new Exception("Usuário ou senha inválidos.");

            bool senhaValida = BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.SenhaHash);

            if (!senhaValida)
                throw new Exception("Usuário ou senha inválidos.");

            return _tokenService.GerarToken(usuario);
        }

        public Usuario AtualizarUsuario(int id, UsuarioUpdateDTO dados)
        {
            var usuario = _context.Usuarios.Find(id);

            if (usuario == null || !usuario.Ativo)
            {
                throw new Exception("Cliente não encontrado.");
            }

            if (!string.IsNullOrWhiteSpace(dados.Nome))
            {
                usuario.Nome = dados.Nome;
            }

            if (!string.IsNullOrWhiteSpace(dados.Email) && dados.Email != usuario.Email)
            {
                bool emailEmUso = _context.Usuarios.Any(c => c.Email == dados.Email && c.Id != id);
                if (emailEmUso)
                {
                    throw new Exception("Este Email já está cadastrado para outro Usuario.");
                }

                usuario.Email = dados.Email;
            }

            _context.SaveChanges();

            return usuario;
        }

        public void ExcluirUsuario(int id)
        {
            var usuario = _context.Usuarios.Find(id);

            if (usuario == null || !usuario.Ativo)
            {
                throw new Exception("Cliente não encontrado para exclusão.");
            }

            usuario.Ativo = false;

            _context.SaveChanges();
        }
    }
}
