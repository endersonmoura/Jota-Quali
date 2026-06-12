# JotaQuali — DDL (Azure SQL Database / SQL Server)

> Gerado por: Análise de Requisitos v1.0

---

## 1. PERFIL

```sql
CREATE TABLE perfil (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    nome_perfil   VARCHAR(50)   NOT NULL UNIQUE,  -- administrador | calibrador | operacional | consulta
    permissoes    NVARCHAR(MAX) NOT NULL DEFAULT '{}' CHECK (ISJSON(permissoes) = 1),
    criado_em     DATETIME2     NOT NULL DEFAULT SYSDATETIME()
);
GO
```

---

## 2. USUARIO

```sql
CREATE TABLE usuario (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    perfil_id     INT          NOT NULL REFERENCES perfil(id),
    nome          VARCHAR(150) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    senha_hash    VARCHAR(255) NOT NULL,
    cpf           VARCHAR(14)  NOT NULL UNIQUE,
    status        VARCHAR(20)  NOT NULL DEFAULT 'ativo'
                  CHECK (status IN ('ativo','inativo')),
    criado_em     DATETIME2    NOT NULL DEFAULT SYSDATETIME(),
    atualizado_em DATETIME2    NOT NULL DEFAULT SYSDATETIME()
);
GO
```

---

## 3. OBRA

```sql
CREATE TABLE obra (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    nome_obra     VARCHAR(200) NOT NULL,
    localizacao   VARCHAR(300),
    status        VARCHAR(20)  NOT NULL DEFAULT 'ativa'
                  CHECK (status IN ('ativa','inativa','concluida')),
    data_cadastro DATE         NOT NULL DEFAULT CAST(SYSDATETIME() AS DATE),
    criado_por    INT          REFERENCES usuario(id),
    criado_em     DATETIME2    NOT NULL DEFAULT SYSDATETIME()
);
GO
```

---

## 4. PADRAO_REFERENCIA

```sql
CREATE TABLE padrao_referencia (
    id                  INT IDENTITY(1,1) PRIMARY KEY,
    codigo              VARCHAR(50)  NOT NULL UNIQUE,
    descricao           VARCHAR(200) NOT NULL,
    tipo                VARCHAR(100),
    validade            DATE,
    status              VARCHAR(30)  NOT NULL DEFAULT 'disponivel'
                        CHECK (status IN ('disponivel','indisponivel','vencido','pendente_assinatura','pendente_documento')),
    situacao_documental VARCHAR(30)  NOT NULL DEFAULT 'regular'
                        CHECK (situacao_documental IN ('regular','pendente','irregular')),
    criado_em           DATETIME2    NOT NULL DEFAULT SYSDATETIME(),
    atualizado_em       DATETIME2    NOT NULL DEFAULT SYSDATETIME()
);
GO
```

---

## 5. EQUIPAMENTO

```sql
CREATE TABLE equipamento (
    id                         INT IDENTITY(1,1) PRIMARY KEY,
    obra_id                    INT          REFERENCES obra(id),
    codigo                     VARCHAR(50)  NOT NULL UNIQUE,
    descricao                  VARCHAR(200) NOT NULL,
    tipo                       VARCHAR(100),
    status                     VARCHAR(40)  NOT NULL DEFAULT 'disponivel'
                               CHECK (status IN (
                                   'disponivel','indisponivel','vencido',
                                   'pendente_assinatura','pendente_documento',
                                   'calibracao_solicitada','em_calibracao','em_manutencao'
                               )),
    situacao_documental        VARCHAR(30)  NOT NULL DEFAULT 'regular'
                               CHECK (situacao_documental IN ('regular','pendente','irregular')),
    data_cadastro              DATE         NOT NULL DEFAULT CAST(SYSDATETIME() AS DATE),
    data_ultima_calibracao     DATE,
    data_vencimento_calibracao DATE,
    criado_por                 INT          REFERENCES usuario(id),
    criado_em                  DATETIME2    NOT NULL DEFAULT SYSDATETIME(),
    atualizado_em              DATETIME2    NOT NULL DEFAULT SYSDATETIME()
);
GO
```

---

## 6. TRANSFERENCIA_EQUIPAMENTO

```sql
CREATE TABLE transferencia_equipamento (
    id                 INT IDENTITY(1,1) PRIMARY KEY,
    equipamento_id     INT           NOT NULL REFERENCES equipamento(id),
    obra_origem_id     INT           REFERENCES obra(id),
    obra_destino_id    INT           NOT NULL REFERENCES obra(id),
    usuario_id         INT           NOT NULL REFERENCES usuario(id),
    data_transferencia DATE          NOT NULL DEFAULT CAST(SYSDATETIME() AS DATE),
    observacao         NVARCHAR(MAX),
    criado_em          DATETIME2     NOT NULL DEFAULT SYSDATETIME()
);
GO
```

---

## 7. CALIBRACAO

```sql
CREATE TABLE calibracao (
    id                   INT IDENTITY(1,1) PRIMARY KEY,
    equipamento_id       INT         NOT NULL REFERENCES equipamento(id),
    padrao_referencia_id INT         REFERENCES padrao_referencia(id),
    usuario_id           INT         NOT NULL REFERENCES usuario(id),
    tipo                 VARCHAR(10) NOT NULL CHECK (tipo IN ('externa','interna')),
    data_realizacao      DATE        NOT NULL,
    data_validade        DATE        NOT NULL,
    cpf_responsavel      VARCHAR(14),
    status               VARCHAR(30) NOT NULL DEFAULT 'pendente_documento'
                         CHECK (status IN ('pendente_documento','pendente_assinatura','concluida','vencida')),
    criado_em            DATETIME2   NOT NULL DEFAULT SYSDATETIME(),
    atualizado_em        DATETIME2   NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT ck_padrao_obrigatorio_interna
        CHECK (tipo = 'externa' OR padrao_referencia_id IS NOT NULL)
);
GO
```

---

## 8. SOLICITACAO_CALIBRACAO

```sql
CREATE TABLE solicitacao_calibracao (
    id                     INT IDENTITY(1,1) PRIMARY KEY,
    equipamento_id         INT         NOT NULL REFERENCES equipamento(id),
    usuario_solicitante_id INT         NOT NULL REFERENCES usuario(id),
    tipo_calibracao        VARCHAR(10) NOT NULL CHECK (tipo_calibracao IN ('externa','interna')),
    data_solicitacao       DATE        NOT NULL DEFAULT CAST(SYSDATETIME() AS DATE),
    prazo_retorno          DATE        NOT NULL,
    status                 VARCHAR(30) NOT NULL DEFAULT 'aberta'
                           CHECK (status IN ('aberta','concluida','prazo_vencido','cancelada')),
    observacao             NVARCHAR(MAX),
    criado_em              DATETIME2   NOT NULL DEFAULT SYSDATETIME(),
    atualizado_em          DATETIME2   NOT NULL DEFAULT SYSDATETIME()
);
GO
```

---

## 9. DOCUMENTO

```sql
CREATE TABLE documento (
    id                   INT IDENTITY(1,1) PRIMARY KEY,
    equipamento_id       INT          REFERENCES equipamento(id),
    calibracao_id        INT          REFERENCES calibracao(id),
    padrao_referencia_id INT          REFERENCES padrao_referencia(id),
    tipo_documental      VARCHAR(30)  NOT NULL
                         CHECK (tipo_documental IN ('laudo_laboratorial','pdf_calibracao_interna')),
    data_emissao         DATE         NOT NULL,
    data_vencimento      DATE         NOT NULL,
    laboratorio          VARCHAR(200),
    status_assinatura    BIT          NOT NULL DEFAULT 0,  -- 0 = FALSE, 1 = TRUE
    path_arquivo         VARCHAR(500),
    criado_em            DATETIME2    NOT NULL DEFAULT SYSDATETIME(),
    atualizado_em        DATETIME2    NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT ck_documento_origem
        CHECK (equipamento_id IS NOT NULL OR calibracao_id IS NOT NULL OR padrao_referencia_id IS NOT NULL)
);
GO
```

---

## 10. ASSINATURA_DIGITAL

```sql
CREATE TABLE assinatura_digital (
    id                   INT IDENTITY(1,1) PRIMARY KEY,
    documento_id         INT        NOT NULL REFERENCES documento(id),
    usuario_id           INT        NOT NULL REFERENCES usuario(id),
    data_hora_assinatura DATETIME2  NOT NULL DEFAULT SYSDATETIME(),
    hash_assinatura      VARCHAR(512),
    ip_origem            VARCHAR(45),
    criado_em            DATETIME2  NOT NULL DEFAULT SYSDATETIME()
);
GO
```

---

## 11. RECURSO_CALIBRACAO

```sql
CREATE TABLE recurso_calibracao (
    id             INT IDENTITY(1,1) PRIMARY KEY,
    calibracao_id  INT          REFERENCES calibracao(id),
    documento_id   INT          REFERENCES documento(id),
    item_descricao VARCHAR(200) NOT NULL,
    quantidade     VARCHAR(50),
    tipo_recurso   VARCHAR(50),
    criado_em      DATETIME2    NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT ck_recurso_origem
        CHECK (calibracao_id IS NOT NULL OR documento_id IS NOT NULL)
);
GO
```

---

## 12. NOTIFICACAO

```sql
CREATE TABLE notificacao (
    id                      INT IDENTITY(1,1) PRIMARY KEY,
    equipamento_id          INT           NOT NULL REFERENCES equipamento(id),
    usuario_destinatario_id INT           REFERENCES usuario(id),
    titulo                  VARCHAR(200)  NOT NULL,
    mensagem                NVARCHAR(MAX) NOT NULL,
    tipo_alerta             VARCHAR(30)   NOT NULL
                            CHECK (tipo_alerta IN (
                                'vencimento_60d','vencimento_30d','vencimento_15d',
                                'vencimento_10d','vencimento_7d_superior',
                                'prazo_retorno_vencido','pendencia_documento'
                            )),
    destinatario_email      VARCHAR(150),
    data_alerta             DATE          NOT NULL,
    data_envio              DATETIME2,
    status_escalonamento    VARCHAR(20)   NOT NULL DEFAULT 'pendente'
                            CHECK (status_escalonamento IN ('pendente','enviada','falhou')),
    criado_em               DATETIME2     NOT NULL DEFAULT SYSDATETIME()
);
GO
```

---

## 13. LOG_AUDITORIA

```sql
CREATE TABLE log_auditoria (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id  INT           NOT NULL,
    acao        VARCHAR(50)   NOT NULL,
    entidade    VARCHAR(50)   NOT NULL,
    entidade_id INT           NOT NULL,
    data_hora   DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    detalhes    NVARCHAR(MAX),

    CONSTRAINT fk_log_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);
GO
```

---

## Índices

```sql
CREATE INDEX idx_equipamento_obra        ON equipamento(obra_id);
CREATE INDEX idx_equipamento_status      ON equipamento(status);
CREATE INDEX idx_equipamento_vencimento  ON equipamento(data_vencimento_calibracao);
CREATE INDEX idx_calibracao_equipamento  ON calibracao(equipamento_id);
CREATE INDEX idx_calibracao_status       ON calibracao(status);
CREATE INDEX idx_documento_calibracao    ON documento(calibracao_id);
CREATE INDEX idx_documento_equipamento   ON documento(equipamento_id);
CREATE INDEX idx_documento_assinatura    ON documento(status_assinatura);
CREATE INDEX idx_solicitacao_equipamento ON solicitacao_calibracao(equipamento_id);
CREATE INDEX idx_solicitacao_prazo       ON solicitacao_calibracao(prazo_retorno);
CREATE INDEX idx_notificacao_equipamento ON notificacao(equipamento_id);
CREATE INDEX idx_notificacao_tipo        ON notificacao(tipo_alerta);
CREATE INDEX idx_transferencia_equip     ON transferencia_equipamento(equipamento_id);
GO
```

---

## Dados Iniciais — Perfis (RN09)

```sql
INSERT INTO perfil (nome_perfil, permissoes) VALUES
    ('administrador', '{"assinar_documento":true,"calibracao":true,"usuarios":true,"relatorios":true,"solicitar_calibracao":true,"editar_perfis":true}'),
    ('calibrador',    '{"assinar_documento":false,"calibracao":true,"usuarios":false,"relatorios":false,"solicitar_calibracao":false,"editar_perfis":false}'),
    ('operacional',   '{"assinar_documento":false,"calibracao":false,"usuarios":false,"relatorios":true,"solicitar_calibracao":false,"editar_perfis":false}'),
    ('consulta',      '{"assinar_documento":false,"calibracao":false,"usuarios":false,"relatorios":false,"solicitar_calibracao":false,"editar_perfis":false}');
GO
```
