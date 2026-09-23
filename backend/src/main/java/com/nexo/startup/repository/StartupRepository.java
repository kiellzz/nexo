package com.nexo.startup.repository;

import com.nexo.startup.entity.Startup;
import com.nexo.startup.enums.EstagioStartup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StartupRepository extends JpaRepository<Startup, UUID> {

    @Query("SELECT s FROM Startup s WHERE " +
           "(:busca IS NULL OR LOWER(s.nome) LIKE LOWER(CONCAT('%', :busca, '%')) OR LOWER(s.descricao) LIKE LOWER(CONCAT('%', :busca, '%'))) AND " +
           "(:setor IS NULL OR LOWER(s.setor) LIKE LOWER(CONCAT('%', :setor, '%'))) AND " +
           "(:estagio IS NULL OR s.estagio = :estagio) AND " +
           "(:estado IS NULL OR s.estado = :estado) " +
           "ORDER BY s.createdAt DESC")
    List<Startup> search(
            @Param("busca") String busca,
            @Param("setor") String setor,
            @Param("estagio") EstagioStartup estagio,
            @Param("estado") String estado
    );
}

