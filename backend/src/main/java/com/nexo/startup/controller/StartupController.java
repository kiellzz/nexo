package com.nexo.startup.controller;

import com.nexo.startup.dto.StartupRequestDTO;
import com.nexo.startup.dto.StartupResponseDTO;
import com.nexo.startup.enums.EstagioStartup;
import com.nexo.startup.exception.GlobalExceptionHandler.ErrorResponse;
import com.nexo.startup.service.StartupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/startups")
@RequiredArgsConstructor
@Tag(name = "Startups", description = "Endpoints de gerenciamento e catálogo das Startups cadastradas na plataforma NEXO")
public class StartupController {

    private final StartupService startupService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Listar startups cadastradas",
            description = "Retorna a coleção de todas as startups cadastradas no NEXO. " +
                    "Permite filtragem dinâmica por termo de busca (nome/descrição), setor, estágio de maturação e UF."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Startups listadas com sucesso",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            array = @ArraySchema(schema = @Schema(implementation = StartupResponseDTO.class))
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Parâmetros de consulta inválidos",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    public ResponseEntity<List<StartupResponseDTO>> findAll(
            @Parameter(description = "Busca textual por nome ou descrição")
            @RequestParam(required = false) String busca,

            @Parameter(description = "Filtro por setor de mercado (ex: EdTech, FinTech)")
            @RequestParam(required = false) String setor,

            @Parameter(description = "Filtro por estágio de maturidade")
            @RequestParam(required = false) EstagioStartup estagio,

            @Parameter(description = "Filtro por Unidade Federativa (UF com 2 letras, ex: SP)")
            @RequestParam(required = false) String estado
    ) {
        List<StartupResponseDTO> startups = startupService.findAll(busca, setor, estagio, estado);
        return ResponseEntity.ok(startups);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Obter startup por ID",
            description = "Recupera os detalhes completos de uma startup registrada através do seu identificador único UUID."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Startup encontrada e retornada com sucesso",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = StartupResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Nenhuma startup encontrada com o ID informado",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Formato de UUID inválido",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    public ResponseEntity<StartupResponseDTO> findById(
            @Parameter(description = "UUID v4 da startup", required = true, example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
            @PathVariable UUID id
    ) {
        StartupResponseDTO startup = startupService.findById(id);
        return ResponseEntity.ok(startup);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Cadastrar nova startup",
            description = "Cria um novo registro de startup no ecossistema NEXO com validação de campos obrigatórios."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Startup cadastrada com sucesso",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = StartupResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Dados do corpo da requisição inválidos ou campos obrigatórios ausentes",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    public ResponseEntity<StartupResponseDTO> create(
            @Parameter(description = "Dados para cadastro da nova startup", required = true)
            @Valid @RequestBody StartupRequestDTO dto
    ) {
        StartupResponseDTO created = startupService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Atualizar dados de uma startup",
            description = "Modifica as informações de uma startup existente a partir de seu identificador UUID."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Startup atualizada com sucesso",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = StartupResponseDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Dados de requisição inválidos ou campos com formato incorreto",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Startup não localizada para o UUID fornecido",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    public ResponseEntity<StartupResponseDTO> update(
            @Parameter(description = "UUID v4 da startup", required = true, example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
            @PathVariable UUID id,

            @Parameter(description = "Dados atualizados da startup", required = true)
            @Valid @RequestBody StartupRequestDTO dto
    ) {
        StartupResponseDTO updated = startupService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Excluir startup",
            description = "Exclui permanentemente o registro de uma startup do banco de dados pelo seu UUID."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204",
                    description = "Startup excluída com sucesso (sem conteúdo no corpo)"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Startup não localizada para o UUID informado",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Formato de UUID inválido",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "UUID v4 da startup", required = true, example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
            @PathVariable UUID id
    ) {
        startupService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

