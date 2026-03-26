using Microsoft.AspNetCore.Mvc;
using APIContratos.Interfaces;
using APIContratos.DTOs.ContratoDTOs;
using Microsoft.AspNetCore.Authorization;

namespace APIContratos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ContratosController : ControllerBase
    {
        private readonly IContratoService _service;

        public ContratosController(IContratoService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult ListarContratos([FromQuery] ContratoFiltroDTO filtro)
        {
            try
            {
                var contratos = _service.VisualizarContratos(filtro);

                if (!contratos.Any())
                    return NotFound("Nenhum contrato encontrado com os filtros informados.");

                return Ok(contratos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno ao buscar contratos: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public IActionResult AtualizarContrato(int id, [FromBody] ContratoUpdateDTO request)
        {
            try
            {
                var contratoAtualizado = _service.AtualizarContrato(id, request);
                return Ok(contratoAtualizado);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("não encontrado"))
                    return NotFound(ex.Message);

                return StatusCode(500, $"Erro interno ao atualizar: {ex.Message}");
            }
        }

        [HttpDelete ("{id}")]
        public IActionResult ExcluirContrato(int id)
        {
            try
            {
                _service.ExcluirContrato(id);

                return Ok(new { mensagem = $"Contrato {id} excluído com sucesso do banco de dados." });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("não encontrado"))
                    return NotFound(ex.Message);

                return StatusCode(500, $"Erro interno ao excluir: {ex.Message}");
            }
        }
    }
}