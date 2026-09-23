package com.nexo.startup.mapper;

import com.nexo.startup.dto.StartupRequestDTO;
import com.nexo.startup.dto.StartupResponseDTO;
import com.nexo.startup.entity.Startup;
import org.springframework.stereotype.Component;

@Component
public class StartupMapper {

    public Startup toEntity(StartupRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        return Startup.builder()
                .nome(dto.nome() != null ? dto.nome().trim() : null)
                .descricao(dto.descricao() != null ? dto.descricao().trim() : null)
                .setor(dto.setor() != null ? dto.setor().trim() : null)
                .estagio(dto.estagio())
                .captacaoObjetivo(dto.captacaoObjetivo())
                .equityOferecida(dto.equityOferecida())
                .cidade(dto.cidade() != null ? dto.cidade().trim() : null)
                .estado(dto.estado() != null ? dto.estado().trim().toUpperCase() : null)
                .website(dto.website() != null ? dto.website().trim() : null)
                .logoUrl(dto.logoUrl() != null ? dto.logoUrl().trim() : null)
                .build();
    }

    public StartupResponseDTO toResponseDTO(Startup entity) {
        if (entity == null) {
            return null;
        }
        return new StartupResponseDTO(
                entity.getId(),
                entity.getNome(),
                entity.getDescricao(),
                entity.getSetor(),
                entity.getEstagio(),
                entity.getCaptacaoObjetivo(),
                entity.getEquityOferecida(),
                entity.getCidade(),
                entity.getEstado(),
                entity.getWebsite(),
                entity.getLogoUrl(),
                entity.getCreatedAt()
        );
    }

    public void updateEntityFromDTO(Startup entity, StartupRequestDTO dto) {
        if (entity == null || dto == null) {
            return;
        }
        entity.setNome(dto.nome() != null ? dto.nome().trim() : entity.getNome());
        entity.setDescricao(dto.descricao() != null ? dto.descricao().trim() : entity.getDescricao());
        entity.setSetor(dto.setor() != null ? dto.setor().trim() : entity.getSetor());
        entity.setEstagio(dto.estagio() != null ? dto.estagio() : entity.getEstagio());
        entity.setCaptacaoObjetivo(dto.captacaoObjetivo());
        entity.setEquityOferecida(dto.equityOferecida());
        entity.setCidade(dto.cidade() != null ? dto.cidade().trim() : entity.getCidade());
        entity.setEstado(dto.estado() != null ? dto.estado().trim().toUpperCase() : entity.getEstado());
        entity.setWebsite(dto.website() != null ? dto.website().trim() : entity.getWebsite());
        entity.setLogoUrl(dto.logoUrl() != null ? dto.logoUrl().trim() : entity.getLogoUrl());
    }
}

