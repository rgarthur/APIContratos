using Microsoft.AspNetCore.Mvc;
using APIContratos.Interfaces;
using APIContratos.DTOs;

namespace APIContratos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContratosController : ControllerBase
    {
        private readonly IContratoService _service;

        public ContratosController(IContratoService service)
        {
            _service = service;
        }

        [HttpPost("importar")]
        public IActionResult ImportarContrato([FromForm] ArquivoUploadDto request)
        {
            try
            {
                IFormFile arquivo = request.Arquivo;

                if (arquivo == null || arquivo.Length == 0)
                    return BadRequest($"O arquivo {nameof(arquivo)} é nulo ou não possui conteudo");

                _service.ProcessarPlanilha(arquivo);

                return Ok("Planilha processada com sucesso!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"ERRO FATAL: {ex.Message} | Detalhe: {ex.InnerException?.Message}");
            }
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