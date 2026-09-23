package com.nexo.startup.dto;

import com.nexo.startup.enums.EstagioStartup;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Schema(name = "StartupResponse", description = "Representação pública de uma Startup no catálogo do NEXO")
public record StartupResponseDTO(

        @Schema(description = "Identificador único universal (UUID v4)", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
        UUID id,

        @Schema(description = "Nome comercial da startup", example = "NovaFlow AI")
        String nome,

        @Schema(description = "Descrição da startup e proposta de valor", example = "Plataforma de otimização logística com inteligência artificial.")
        String descricao,

        @Schema(description = "Setor ou mercado de atuação", example = "Logística & Supply Chain")
        String setor,

        @Schema(description = "Estágio de maturidade atual", example = "SEED")
        EstagioStartup estagio,

        @Schema(description = "Valor pretendido de captação (R$)", example = "1500000.00")
        BigDecimal captacaoObjetivo,

        @Schema(description = "Percentual de participação oferecida (%)", example = "15.00")
        BigDecimal equityOferecida,

        @Schema(description = "Cidade sede", example = "São Paulo")
        String cidade,

        @Schema(description = "Sigla do Estado (UF)", example = "SP")
        String estado,

        @Schema(description = "Website institucional", example = "https://novaflow.com.br")
        String website,

        @Schema(description = "URL do logotipo", example = "https://cdn.nexo.app/logos/novaflow.png")
        String logoUrl,

        @Schema(description = "Data e hora de registro no sistema", example = "2026-09-23T15:30:00")
        LocalDateTime createdAt
) {}

