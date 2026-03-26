using APIContratos.DTOs.ClienteDTOs;
using APIContratos.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIContratos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClientesController : ControllerBase
    {
        private readonly IClienteService _service;

        public ClientesController(IClienteService service)
        {
            _service = service;
        }

        [HttpPost]
        public IActionResult AdicionarCliente ([FromBody] AdicionarClienteDTO request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Nome) || string.IsNullOrWhiteSpace(request.Cpf))
                {
                    return BadRequest("Nome e CPF são obrigatórios.");
                }

                var clienteCriado = _service.AdicionarCliente(request);
                return Ok(clienteCriado);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("CPF"))
                    return BadRequest(ex.Message);

                return StatusCode(500, $"Erro interno ao adicionar cliente: {ex.Message}");
            }
        }

        [HttpGet]
        public IActionResult ListarClientes([FromQuery] ClienteFiltroDTO filtro)
        {
            try
            {
                var clientes = _service.VisualizarClientes(filtro);

                if (!clientes.Any())
                    return NotFound("Nenhum contrato encontrado com os filtros informados.");

                return Ok(clientes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno ao buscar contratos: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public IActionResult AtualizarCliente(int id, [FromBody] ClienteUpdateDTO request)
        {
            try
            {
                var clienteAtualizado = _service.AtualizarCliente(id, request);
                return Ok(clienteAtualizado);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("não encontrado"))
                    return NotFound(ex.Message);

                if (ex.Message.Contains("CPF já está cadastrado"))
                    return BadRequest(ex.Message);

                return StatusCode(500, $"Erro interno ao atualizar cliente: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult ExcluirCliente(int id)
        {
            try
            {
                _service.ExcluirCliente(id);

                return Ok(new { mensagem = $"O cliente com o ID {id} foi excluído com sucesso do sistema." });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("não encontrado"))
                    return NotFound(ex.Message);

                return StatusCode(500, $"Erro interno ao excluir cliente: {ex.Message}");
            }
        }
    }
}
