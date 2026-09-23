package com.nexo.startup.entity;

import com.nexo.startup.enums.EstagioStartup;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "startups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Startup {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "nome", nullable = false, length = 150)
    private String nome;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "setor", length = 100)
    private String setor;

    @Enumerated(EnumType.STRING)
    @Column(name = "estagio", length = 30)
    private EstagioStartup estagio;

    @Column(name = "captacao_objetivo", precision = 15, scale = 2)
    private BigDecimal captacaoObjetivo;

    @Column(name = "equity_oferecida", precision = 5, scale = 2)
    private BigDecimal equityOferecida;

    @Column(name = "cidade", length = 100)
    private String cidade;

    @Column(name = "estado", length = 2)
    private String estado;

    @Column(name = "website", length = 255)
    private String website;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}

