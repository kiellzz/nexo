# 🚀 NEXO Backend — API REST & OpenAPI Specification

API REST desenvolvida em **Spring Boot 3** e **PostgreSQL** para o gerenciamento de Startups da plataforma **NEXO**, com documentação interativa gerada pelo **Springdoc OpenAPI (Swagger)**.

---

## 🛠️ Stack Tecnológica

- **Java**: 17+
- **Framework**: Spring Boot 3.3.5
- **ORM / Persistência**: Spring Data JPA + Hibernate
- **Banco de Dados**: PostgreSQL
- **Validação**: Jakarta Bean Validation (`spring-boot-starter-validation`)
- **Documentação da API**: Springdoc OpenAPI v2.6.0 (Swagger UI + v3 api-docs)
- **Produtividade**: Lombok

---

## 📋 Entidade Startup

A entidade `Startup` é persistida no PostgreSQL com os seguintes atributos:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `UUID` | Identificador único universal gerado automaticamente |
| `nome` | `String (VARCHAR 150)` | Nome comercial ou razão social da startup (obrigatório) |
| `descricao` | `String (TEXT)` | Proposta de valor e modelo de negócio detalhados |
| `setor` | `String (VARCHAR 100)` | Setor de mercado (ex: FinTech, HealthTech, AgTech) |
| `estagio` | `Enum (VARCHAR 30)` | `IDEIA`, `MVP`, `SEED`, `SERIES_A` |
| `captacaoObjetivo` | `BigDecimal (15,2)` | Valor pretendido de captação em R$ |
| `equityOferecida` | `BigDecimal (5,2)` | Percentual societário ofertado aos investidores (%) |
| `cidade` | `String (VARCHAR 100)` | Cidade sede |
| `estado` | `String (CHAR 2)` | Sigla da UF com 2 letras maiúsculas (ex: `SP`, `RJ`, `MG`) |
| `website` | `String (VARCHAR 255)` | URL oficial do website |
| `logoUrl` | `String (VARCHAR 500)` | URL da imagem de logotipo / avatar |
| `createdAt` | `LocalDateTime` | Carimbo de data/hora de criação (gerado via `@CreationTimestamp`) |

---

## 🌐 Endpoints REST

| Método | Endpoint | Descrição | Status de Resposta |
|---|---|---|---|
| `GET` | `/api/startups` | Listar startups com filtros (`busca`, `setor`, `estagio`, `estado`) | `200 OK`, `400 Bad Request` |
| `GET` | `/api/startups/{id}` | Buscar detalhes de uma startup por UUID | `200 OK`, `404 Not Found`, `400 Bad Request` |
| `POST` | `/api/startups` | Cadastrar nova startup | `201 Created`, `400 Bad Request` |
| `PUT` | `/api/startups/{id}` | Atualizar dados de uma startup existente | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/startups/{id}` | Excluir startup permanentemente | `204 No Content`, `404 Not Found`, `400 Bad Request` |

---

## 📖 Documentação OpenAPI 3 / Swagger

Com a aplicação em execução, acesse no navegador:

- **Swagger UI Interativo**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Especificação OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

A documentação conta com:
- Tags temáticas (`Startups`)
- Resumo (`summary`) e descrição detalhada (`description`) para cada operação
- Respostas mapeadas: `200 OK`, `201 Created`, `400 Bad Request` e `404 Not Found`
- Schemas dos DTOs: `StartupRequest`, `StartupResponse` e `ApiErrorResponse`

---

## ⚙️ Configuração e Execução

### 1. Pré-requisitos

1. **JDK 17 ou superior** instalado (Spring Boot 3 requer Java 17+).
2. **PostgreSQL** instalado e ativo (ou uma instância na nuvem como Neon, Supabase, Railway).

### 2. Configurar o Banco

Crie o banco de dados no PostgreSQL:

```sql
CREATE DATABASE nexo;
```

Se desejar alterar usuário/senha ou porta do PostgreSQL, configure as variáveis de ambiente ou altere o arquivo `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/nexo
spring.datasource.username=postgres
spring.datasource.password=postgres
```

### 3. Executar o Backend

No diretório `backend`:

```bash
# Com Maven instalado:
mvn spring-boot:run

# Ou gerando o pacote JAR:
mvn clean package -DskipTests
java -jar target/nexo-backend-0.0.1-SNAPSHOT.jar
```

A API inicializará por padrão em `http://localhost:8080`.

