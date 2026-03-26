using APIContratos.DTOs.ContratoDTOs;
using APIContratos.Interfaces;
using APIContratos.UseCases;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIContratos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ArquivosController : ControllerBase
    {
        private readonly IArquivoService _arquivoService;
        private readonly ImportarPlanilhaUseCase _importarPlanilhaUseCase;

        public ArquivosController(
            IArquivoService arquivoService,
            ImportarPlanilhaUseCase importarPlanilhaUseCase)
        {
            _arquivoService = arquivoService;
            _importarPlanilhaUseCase = importarPlanilhaUseCase;
        }

        [HttpPost("importar")]
        public IActionResult ImportarPlanilha([FromForm] ArquivoUploadDto request)
        {
            try
            {
                if (request.Arquivo == null || request.Arquivo.Length == 0)
                    return BadRequest("O arquivo é nulo ou não possui conteúdo.");

                _importarPlanilhaUseCase.Processar(request.Arquivo);

                return Ok(new { mensagem = $"Arquivo {request.Arquivo.FileName} processado com sucesso!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }

        [HttpGet]
        public IActionResult ListarHistorico()
        {
            try
            {
                var historico = _arquivoService.ObterHistoricoArquivos();
                return Ok(historico);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao buscar histórico: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult ExcluirArquivo(int id)
        {
            try
            {
                _arquivoService.ExcluirArquivo(id);

                return Ok(new { mensagem = $"O Arquivo com o ID {id} foi excluído com sucesso do sistema." });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("não encontrado"))
                    return NotFound(ex.Message);

                return StatusCode(500, $"Erro interno ao excluir arquivo: {ex.Message}");
            }
        }
    }
}