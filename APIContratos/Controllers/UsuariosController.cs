using APIContratos.DTOs.UsuarioDTOs;
using APIContratos.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIContratos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;

        public UsuariosController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpPost("registrar")]
        [AllowAnonymous]
        public IActionResult Registrar([FromBody] UsuarioRegistroDTO dto)
        {
            try
            {
                _usuarioService.Registrar(dto);
                return Ok(new { mensagem = "Usuário criado com sucesso!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login([FromBody] UsuarioLoginDTO dto)
        {
            try
            {
                var token = _usuarioService.Autenticar(dto);
                return Ok(new { token = token });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { erro = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public IActionResult AtualizarUsuario(int id, [FromBody] UsuarioUpdateDTO request)
        {
            try
            {
                var usuarioAtualizado = _usuarioService.AtualizarUsuario(id, request);
                return Ok(usuarioAtualizado);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("não encontrado"))
                    return NotFound(ex.Message);

                if (ex.Message.Contains("E-mail já está cadastrado"))
                    return BadRequest(ex.Message);

                return StatusCode(500, $"Erro interno ao atualizar usuario: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult ExcluirUsuario(int id)
        {
            try
            {
                _usuarioService.ExcluirUsuario(id);

                return Ok(new { mensagem = $"O usuario com o ID {id} foi excluído com sucesso do sistema." });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("não encontrado"))
                    return NotFound(ex.Message);

                return StatusCode(500, $"Erro interno ao excluir usuario: {ex.Message}");
            }
        }
    }
}