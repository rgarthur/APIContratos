using APIContratos.Data;
using APIContratos.DTOs.ClienteDTOs;
using APIContratos.Interfaces;
using APIContratos.Models;
using Microsoft.EntityFrameworkCore;


namespace APIContratos.Services
{
    public class ClienteService : IClienteService
    {
        private readonly AppDbContext _context;

        public ClienteService(AppDbContext context)
        {
            _context = context;
        }

        public Cliente AdicionarCliente(AdicionarClienteDTO dto)
        {
            bool cpfJaExiste = _context.Clientes.Any(c => c.Cpf == dto.Cpf);

            if (cpfJaExiste)
            {
                throw new Exception("Já existe um cliente cadastrado com este CPF.");
            }

            Cliente novoCliente = new Cliente()
            {
                Nome = dto.Nome,
                Cpf = dto.Cpf
            };

            _context.Clientes.Add(novoCliente);
            _context.SaveChanges();

            return novoCliente;
        }
        public IEnumerable<Cliente> VisualizarClientes(ClienteFiltroDTO filtro)
        {
            var query = _context.Clientes.Where(c => c.Valido).AsQueryable();
            if (!string.IsNullOrWhiteSpace(filtro.Nome)) query = query.Where(c => c.Nome.Contains(filtro.Nome));
            if (!string.IsNullOrWhiteSpace(filtro.Cpf)) query = query.Where(c => c.Cpf == filtro.Cpf);

            return query.ToList();
        }

        public Cliente AtualizarCliente(int id, ClienteUpdateDTO dados)
        {
            var cliente = _context.Clientes.Find(id);

            if (cliente == null || !cliente.Valido)
            {
                throw new Exception("Cliente não encontrado.");
            }

            if (!string.IsNullOrWhiteSpace(dados.Nome))
            {
                cliente.Nome = dados.Nome;
            }

            if (!string.IsNullOrWhiteSpace(dados.Cpf) && dados.Cpf != cliente.Cpf)
            {
                bool cpfEmUso = _context.Clientes.Any(c => c.Cpf == dados.Cpf && c.Id != id);
                if (cpfEmUso)
                {
                    throw new Exception("Este CPF já está cadastrado para outro cliente.");
                }

                cliente.Cpf = dados.Cpf;
            }

            _context.SaveChanges();

            return cliente;
        }

        public void ExcluirCliente(int id)
        {
            var cliente = _context.Clientes.Find(id);

            if (cliente == null || !cliente.Valido)
            {
                throw new Exception("Cliente não encontrado para exclusão.");
            }

            cliente.Valido = false;

            _context.SaveChanges();
        }

        public IEnumerable<Cliente> VerificarCPFs(string[] cpfs)
        {
            List<Cliente> clientesExistentes = _context.Clientes.Where(c => cpfs.Contains(c.Cpf)).ToList();
            return clientesExistentes;
        }

        public void AdicionarBulkClientes(IEnumerable<Cliente> novosClientes)
        {
            if (novosClientes != null && novosClientes.Any())
            {
                _context.Clientes.AddRange(novosClientes);
            }
        }
    }
}
