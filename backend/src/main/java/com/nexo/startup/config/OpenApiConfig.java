package com.nexo.startup.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI nexoOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("NEXO Startup Management API")
                        .description("API REST para gerenciamento e catálogo completo de Startups no ecossistema NEXO. " +
                                "Permite cadastrar, consultar, atualizar e excluir startups, fornecendo metadados " +
                                "essenciais para análise de investimento e conexões de mercado.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("NEXO Core Team")
                                .email("contato@nexo.app")
                                .url("https://nexo.app"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Servidor Local de Desenvolvimento")
                ));
    }
}

