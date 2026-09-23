package com.nexo.startup.service;

import com.nexo.startup.dto.StartupRequestDTO;
import com.nexo.startup.dto.StartupResponseDTO;
import com.nexo.startup.entity.Startup;
import com.nexo.startup.enums.EstagioStartup;
import com.nexo.startup.exception.ResourceNotFoundException;
import com.nexo.startup.mapper.StartupMapper;
import com.nexo.startup.repository.StartupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StartupService {

    private final StartupRepository startupRepository;
    private final StartupMapper startupMapper;

    @Transactional(readOnly = true)
    public List<StartupResponseDTO> findAll(String busca, String setor, EstagioStartup estagio, String estado) {
        List<Startup> results;
        if ((busca != null && !busca.isBlank()) ||
            (setor != null && !setor.isBlank()) ||
            estagio != null ||
            (estado != null && !estado.isBlank())) {
            results = startupRepository.search(
                    (busca != null && !busca.isBlank()) ? busca.trim() : null,
                    (setor != null && !setor.isBlank()) ? setor.trim() : null,
                    estagio,
                    (estado != null && !estado.isBlank()) ? estado.trim().toUpperCase() : null
            );
        } else {
            results = startupRepository.findAll();
        }

        return results.stream()
                .map(startupMapper::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public StartupResponseDTO findById(UUID id) {
        Startup startup = startupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        return startupMapper.toResponseDTO(startup);
    }

    @Transactional
    public StartupResponseDTO create(StartupRequestDTO dto) {
        Startup entity = startupMapper.toEntity(dto);
        Startup saved = startupRepository.save(entity);
        return startupMapper.toResponseDTO(saved);
    }

    @Transactional
    public StartupResponseDTO update(UUID id, StartupRequestDTO dto) {
        Startup startup = startupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));

        startupMapper.updateEntityFromDTO(startup, dto);
        Startup updated = startupRepository.save(startup);
        return startupMapper.toResponseDTO(updated);
    }

    @Transactional
    public void delete(UUID id) {
        if (!startupRepository.existsById(id)) {
            throw new ResourceNotFoundException(id);
        }
        startupRepository.deleteById(id);
    }
}

