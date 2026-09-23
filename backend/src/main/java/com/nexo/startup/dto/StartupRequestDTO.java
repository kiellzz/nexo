package com.nexo.startup.dto;

import com.nexo.startup.enums.EstagioStartup;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

@Schema(name = "StartupRequest", description = "Payload para criação ou atualização de uma Startup")
public record StartupRequestDTO(

        @Schema(description = "Nome comercial ou razão da startup", example = "NovaFlow AI", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "O nome da startup é obrigatório")
        @Size(min = 2, max = 150, message = "O nome deve ter entre 2 e 150 caracteres")
        String nome,

        @Schema(description = "Descrição detalhada do modelo de negócio e proposta de valor", example = "Plataforma de otimização logística em tempo real impulsionada por modelos preditivos.")
        @Size(max = 2000, message = "A descrição não pode ultrapassar 2000 caracteres")
        String descricao,

        @Schema(description = "Setor ou mercado de atuação", example = "Logística & Supply Chain", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "O setor é obrigatório")
        @Size(max = 100, message = "O setor deve ter no máximo 100 caracteres")
        String setor,

        @Schema(description = "Estágio atual de maturação", example = "SEED", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "O estágio é obrigatório (IDEIA, MVP, SEED ou SERIES_A)")
        EstagioStartup estagio,

        @Schema(description = "Valor pretendido de captação na rodada (em R$)", example = "1500000.00")
        @DecimalMin(value = "0.0", inclusive = false, message = "A captação objetiva deve ser maior que zero")
        BigDecimal captacaoObjetivo,

        @Schema(description = "Percentual de participação acionária ofertada aos investidores (%)", example = "15.00")
        @DecimalMin(value = "0.0", message = "A equity oferecida não pode ser negativa")
        @DecimalMax(value = "100.0", message = "A equity oferecida não pode ultrapassar 100%")
        BigDecimal equityOferecida,

        @Schema(description = "Cidade sede da startup", example = "São Paulo")
        @Size(max = 100, message = "A cidade deve ter no máximo 100 caracteres")
        String cidade,

        @Schema(description = "Sigla da Unidade Federativa (UF com 2 letras)", example = "SP")
        @Pattern(regexp = "^[A-Z]{2}$", message = "O estado deve conter exatamente 2 letras maiúsculas (ex: SP, RJ, MG)")
        String estado,

        @Schema(description = "Endereço do website oficial", example = "https://novaflow.com.br")
        @Size(max = 255, message = "O website não pode ultrapassar 255 caracteres")
        String website,

        @Schema(description = "URL com o logotipo ou imagem de avatar da startup", example = "https://cdn.nexo.app/logos/novaflow.png")
        @Size(max = 500, message = "A URL da logo não pode ultrapassar 500 caracteres")
        String logoUrl
) {}

