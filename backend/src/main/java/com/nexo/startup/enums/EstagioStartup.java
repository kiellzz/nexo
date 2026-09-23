package com.nexo.startup.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Estágio de maturidade da startup no ecossistema de venture capital")
public enum EstagioStartup {
    @Schema(description = "Fase de ideação e validação conceitual do problema")
    IDEIA,

    @Schema(description = "Produto Mínimo Viável desenvolvido e em fase de testes/primeiros usuários")
    MVP,

    @Schema(description = "Produto validado no mercado com receita inicial buscando tração")
    SEED,

    @Schema(description = "Modelo escalável validado buscando aceleração de crescimento e market share")
    SERIES_A
}

