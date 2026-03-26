using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APIContratos.Migrations
{
    /// <inheritdoc />
    public partial class AjusteFkArquivo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contratos_Arquivos_UploadId",
                table: "Contratos");

            migrationBuilder.DropIndex(
                name: "IX_Contratos_UploadId",
                table: "Contratos");

            migrationBuilder.DropColumn(
                name: "UploadId",
                table: "Contratos");

            migrationBuilder.CreateIndex(
                name: "IX_Contratos_IdArquivo",
                table: "Contratos",
                column: "IdArquivo");

            migrationBuilder.AddForeignKey(
                name: "FK_Contratos_Arquivos_IdArquivo",
                table: "Contratos",
                column: "IdArquivo",
                principalTable: "Arquivos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contratos_Arquivos_IdArquivo",
                table: "Contratos");

            migrationBuilder.DropIndex(
                name: "IX_Contratos_IdArquivo",
                table: "Contratos");

            migrationBuilder.AddColumn<int>(
                name: "UploadId",
                table: "Contratos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Contratos_UploadId",
                table: "Contratos",
                column: "UploadId");

            migrationBuilder.AddForeignKey(
                name: "FK_Contratos_Arquivos_UploadId",
                table: "Contratos",
                column: "UploadId",
                principalTable: "Arquivos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
