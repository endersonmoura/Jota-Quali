/*
  JotaQuali - Banco inicial (SQL Server)
  Escopo: usuarios, perfis, permissoes por tela, vinculo usuario-perfil e log de auditoria.

  Observacao:
  - Este script e idempotente (pode ser executado mais de uma vez).
  - Para Azure SQL, o CREATE DATABASE pode exigir permissao no banco master.
  - A regra "apenas administrador altera permissoes" deve ser aplicada no backend/controle de acesso.
*/

IF DB_ID(N'JotaQuali') IS NULL
BEGIN
  CREATE DATABASE [JotaQuali];
END;
GO

USE [JotaQuali];
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'auth')
BEGIN
  EXEC(N'CREATE SCHEMA auth');
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'app')
BEGIN
  EXEC(N'CREATE SCHEMA app');
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'audit')
BEGIN
  EXEC(N'CREATE SCHEMA audit');
END;
GO

IF OBJECT_ID(N'auth.usuario', N'U') IS NULL
BEGIN
  CREATE TABLE auth.usuario (
    id_usuario UNIQUEIDENTIFIER NOT NULL
      CONSTRAINT PK_auth_usuario PRIMARY KEY
      CONSTRAINT DF_auth_usuario_id_usuario DEFAULT NEWSEQUENTIALID(),
    nome NVARCHAR(150) NOT NULL,
    email NVARCHAR(254) NOT NULL,
    senha_hash NVARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NULL,
    telefone NVARCHAR(20) NULL,
    cargo NVARCHAR(100) NULL,
    ativo BIT NOT NULL
      CONSTRAINT DF_auth_usuario_ativo DEFAULT (1),
    data_cadastro DATETIME2(0) NOT NULL
      CONSTRAINT DF_auth_usuario_data_cadastro DEFAULT SYSUTCDATETIME(),
    data_atualizacao DATETIME2(0) NOT NULL
      CONSTRAINT DF_auth_usuario_data_atualizacao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_auth_usuario_email_formato CHECK (email LIKE '%_@_%._%'),
    CONSTRAINT CK_auth_usuario_cpf_formato CHECK (
      cpf IS NULL
      OR (LEN(cpf) = 11 AND cpf NOT LIKE '%[^0-9]%')
    )
  );
END;
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = N'UX_auth_usuario_email'
    AND object_id = OBJECT_ID(N'auth.usuario')
)
BEGIN
  CREATE UNIQUE INDEX UX_auth_usuario_email
    ON auth.usuario (email);
END;
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = N'UX_auth_usuario_cpf'
    AND object_id = OBJECT_ID(N'auth.usuario')
)
BEGIN
  CREATE UNIQUE INDEX UX_auth_usuario_cpf
    ON auth.usuario (cpf)
    WHERE cpf IS NOT NULL;
END;
GO

IF OBJECT_ID(N'auth.perfil', N'U') IS NULL
BEGIN
  CREATE TABLE auth.perfil (
    id_perfil UNIQUEIDENTIFIER NOT NULL
      CONSTRAINT PK_auth_perfil PRIMARY KEY
      CONSTRAINT DF_auth_perfil_id_perfil DEFAULT NEWSEQUENTIALID(),
    nome NVARCHAR(80) NOT NULL,
    descricao NVARCHAR(300) NULL,
    ativo BIT NOT NULL
      CONSTRAINT DF_auth_perfil_ativo DEFAULT (1),
    perfil_sistema BIT NOT NULL
      CONSTRAINT DF_auth_perfil_perfil_sistema DEFAULT (0),
    data_cadastro DATETIME2(0) NOT NULL
      CONSTRAINT DF_auth_perfil_data_cadastro DEFAULT SYSUTCDATETIME()
  );
END;
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = N'UX_auth_perfil_nome'
    AND object_id = OBJECT_ID(N'auth.perfil')
)
BEGIN
  CREATE UNIQUE INDEX UX_auth_perfil_nome
    ON auth.perfil (nome);
END;
GO

IF OBJECT_ID(N'auth.usuario_perfil', N'U') IS NULL
BEGIN
  CREATE TABLE auth.usuario_perfil (
    id_usuario_perfil UNIQUEIDENTIFIER NOT NULL
      CONSTRAINT PK_auth_usuario_perfil PRIMARY KEY
      CONSTRAINT DF_auth_usuario_perfil_id DEFAULT NEWSEQUENTIALID(),
    id_usuario UNIQUEIDENTIFIER NOT NULL,
    id_perfil UNIQUEIDENTIFIER NOT NULL,
    ativo BIT NOT NULL
      CONSTRAINT DF_auth_usuario_perfil_ativo DEFAULT (1),
    data_vinculo DATETIME2(0) NOT NULL
      CONSTRAINT DF_auth_usuario_perfil_data_vinculo DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_auth_usuario_perfil_usuario
      FOREIGN KEY (id_usuario) REFERENCES auth.usuario (id_usuario),
    CONSTRAINT FK_auth_usuario_perfil_perfil
      FOREIGN KEY (id_perfil) REFERENCES auth.perfil (id_perfil)
  );
END;
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = N'UX_auth_usuario_perfil_ativo'
    AND object_id = OBJECT_ID(N'auth.usuario_perfil')
)
BEGIN
  CREATE UNIQUE INDEX UX_auth_usuario_perfil_ativo
    ON auth.usuario_perfil (id_usuario, id_perfil)
    WHERE ativo = 1;
END;
GO

IF OBJECT_ID(N'app.modulo', N'U') IS NULL
BEGIN
  CREATE TABLE app.modulo (
    id_modulo UNIQUEIDENTIFIER NOT NULL
      CONSTRAINT PK_app_modulo PRIMARY KEY
      CONSTRAINT DF_app_modulo_id_modulo DEFAULT NEWSEQUENTIALID(),
    nome NVARCHAR(80) NOT NULL,
    descricao NVARCHAR(300) NULL,
    ordem INT NOT NULL,
    ativo BIT NOT NULL
      CONSTRAINT DF_app_modulo_ativo DEFAULT (1)
  );
END;
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = N'UX_app_modulo_nome'
    AND object_id = OBJECT_ID(N'app.modulo')
)
BEGIN
  CREATE UNIQUE INDEX UX_app_modulo_nome
    ON app.modulo (nome);
END;
GO

IF OBJECT_ID(N'app.tela', N'U') IS NULL
BEGIN
  CREATE TABLE app.tela (
    id_tela UNIQUEIDENTIFIER NOT NULL
      CONSTRAINT PK_app_tela PRIMARY KEY
      CONSTRAINT DF_app_tela_id_tela DEFAULT NEWSEQUENTIALID(),
    id_modulo UNIQUEIDENTIFIER NOT NULL,
    nome NVARCHAR(120) NOT NULL,
    chave NVARCHAR(80) NOT NULL,
    rota NVARCHAR(200) NULL,
    ordem INT NOT NULL,
    ativo BIT NOT NULL
      CONSTRAINT DF_app_tela_ativo DEFAULT (1),
    CONSTRAINT FK_app_tela_modulo
      FOREIGN KEY (id_modulo) REFERENCES app.modulo (id_modulo)
  );
END;
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = N'UX_app_tela_chave'
    AND object_id = OBJECT_ID(N'app.tela')
)
BEGIN
  CREATE UNIQUE INDEX UX_app_tela_chave
    ON app.tela (chave);
END;
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = N'UX_app_tela_modulo_ordem'
    AND object_id = OBJECT_ID(N'app.tela')
)
BEGIN
  CREATE UNIQUE INDEX UX_app_tela_modulo_ordem
    ON app.tela (id_modulo, ordem);
END;
GO

IF OBJECT_ID(N'auth.perfil_permissao', N'U') IS NULL
BEGIN
  CREATE TABLE auth.perfil_permissao (
    id_perfil_permissao UNIQUEIDENTIFIER NOT NULL
      CONSTRAINT PK_auth_perfil_permissao PRIMARY KEY
      CONSTRAINT DF_auth_perfil_permissao_id DEFAULT NEWSEQUENTIALID(),
    id_perfil UNIQUEIDENTIFIER NOT NULL,
    id_tela UNIQUEIDENTIFIER NOT NULL,
    pode_visualizar BIT NOT NULL
      CONSTRAINT DF_auth_perfil_permissao_visualizar DEFAULT (0),
    pode_cadastrar BIT NOT NULL
      CONSTRAINT DF_auth_perfil_permissao_cadastrar DEFAULT (0),
    pode_editar BIT NOT NULL
      CONSTRAINT DF_auth_perfil_permissao_editar DEFAULT (0),
    pode_excluir BIT NOT NULL
      CONSTRAINT DF_auth_perfil_permissao_excluir DEFAULT (0),
    pode_configurar BIT NOT NULL
      CONSTRAINT DF_auth_perfil_permissao_configurar DEFAULT (0),
    data_cadastro DATETIME2(0) NOT NULL
      CONSTRAINT DF_auth_perfil_permissao_data_cadastro DEFAULT SYSUTCDATETIME(),
    data_atualizacao DATETIME2(0) NOT NULL
      CONSTRAINT DF_auth_perfil_permissao_data_atualizacao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_auth_perfil_permissao_perfil
      FOREIGN KEY (id_perfil) REFERENCES auth.perfil (id_perfil),
    CONSTRAINT FK_auth_perfil_permissao_tela
      FOREIGN KEY (id_tela) REFERENCES app.tela (id_tela)
  );
END;
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = N'UX_auth_perfil_permissao_perfil_tela'
    AND object_id = OBJECT_ID(N'auth.perfil_permissao')
)
BEGIN
  CREATE UNIQUE INDEX UX_auth_perfil_permissao_perfil_tela
    ON auth.perfil_permissao (id_perfil, id_tela);
END;
GO

IF OBJECT_ID(N'audit.log_acao', N'U') IS NULL
BEGIN
  CREATE TABLE audit.log_acao (
    id_log BIGINT NOT NULL IDENTITY(1,1)
      CONSTRAINT PK_audit_log_acao PRIMARY KEY,
    id_usuario UNIQUEIDENTIFIER NULL,
    entidade NVARCHAR(100) NOT NULL,
    id_registro NVARCHAR(100) NOT NULL,
    acao NVARCHAR(50) NOT NULL,
    descricao NVARCHAR(1000) NULL,
    data_acao DATETIME2(0) NOT NULL
      CONSTRAINT DF_audit_log_acao_data_acao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_audit_log_acao_usuario
      FOREIGN KEY (id_usuario) REFERENCES auth.usuario (id_usuario)
  );
END;
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = N'IX_audit_log_acao_data_acao'
    AND object_id = OBJECT_ID(N'audit.log_acao')
)
BEGIN
  CREATE INDEX IX_audit_log_acao_data_acao
    ON audit.log_acao (data_acao DESC);
END;
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = N'IX_audit_log_acao_usuario'
    AND object_id = OBJECT_ID(N'audit.log_acao')
)
BEGIN
  CREATE INDEX IX_audit_log_acao_usuario
    ON audit.log_acao (id_usuario, data_acao DESC);
END;
GO

CREATE OR ALTER TRIGGER auth.trg_usuario_set_data_atualizacao
ON auth.usuario
AFTER UPDATE
AS
BEGIN
  SET NOCOUNT ON;

  IF TRIGGER_NESTLEVEL() > 1
    RETURN;

  UPDATE u
     SET data_atualizacao = SYSUTCDATETIME()
    FROM auth.usuario u
    INNER JOIN inserted i
      ON i.id_usuario = u.id_usuario;
END;
GO

CREATE OR ALTER TRIGGER auth.trg_perfil_permissao_set_data_atualizacao
ON auth.perfil_permissao
AFTER UPDATE
AS
BEGIN
  SET NOCOUNT ON;

  IF TRIGGER_NESTLEVEL() > 1
    RETURN;

  UPDATE pp
     SET data_atualizacao = SYSUTCDATETIME()
    FROM auth.perfil_permissao pp
    INNER JOIN inserted i
      ON i.id_perfil_permissao = pp.id_perfil_permissao;
END;
GO

CREATE OR ALTER TRIGGER auth.trg_usuario_soft_delete
ON auth.usuario
INSTEAD OF DELETE
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE u
     SET ativo = 0,
         data_atualizacao = SYSUTCDATETIME()
    FROM auth.usuario u
    INNER JOIN deleted d
      ON d.id_usuario = u.id_usuario;
END;
GO

CREATE OR ALTER TRIGGER auth.trg_perfil_soft_delete
ON auth.perfil
INSTEAD OF DELETE
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE p
     SET ativo = 0
    FROM auth.perfil p
    INNER JOIN deleted d
      ON d.id_perfil = p.id_perfil;
END;
GO

CREATE OR ALTER TRIGGER auth.trg_usuario_perfil_soft_delete
ON auth.usuario_perfil
INSTEAD OF DELETE
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE upf
     SET ativo = 0
    FROM auth.usuario_perfil upf
    INNER JOIN deleted d
      ON d.id_usuario_perfil = upf.id_usuario_perfil;
END;
GO

;WITH source_perfis AS (
  SELECT
    v.nome,
    v.descricao,
    v.perfil_sistema
  FROM (VALUES
    (N'Administrador', N'Acesso total ao sistema', CAST(1 AS BIT)),
    (N'Calibrador', N'Operacoes de calibracao e consulta de dados', CAST(1 AS BIT)),
    (N'Operacional', N'Operacoes de cadastro e manutencao operacional', CAST(1 AS BIT)),
    (N'Consulta', N'Acesso somente leitura', CAST(1 AS BIT))
  ) v(nome, descricao, perfil_sistema)
)
MERGE auth.perfil AS target
USING source_perfis AS source
ON target.nome = source.nome
WHEN MATCHED THEN
  UPDATE SET
    target.descricao = source.descricao,
    target.perfil_sistema = source.perfil_sistema,
    target.ativo = 1
WHEN NOT MATCHED THEN
  INSERT (nome, descricao, ativo, perfil_sistema)
  VALUES (source.nome, source.descricao, 1, source.perfil_sistema);
GO

;WITH source_modulos AS (
  SELECT
    v.nome,
    v.descricao,
    v.ordem
  FROM (VALUES
    (N'Administracao', N'Gestao de usuarios, perfis e permissoes', 1),
    (N'Equipamentos', N'Cadastro e controle de equipamentos', 2),
    (N'Obras', N'Cadastro e acompanhamento de obras', 3),
    (N'Calibracoes', N'Gestao de calibracao interna e externa', 4),
    (N'Relatorios', N'Emissao e consulta de relatorios', 5)
  ) v(nome, descricao, ordem)
)
MERGE app.modulo AS target
USING source_modulos AS source
ON target.nome = source.nome
WHEN MATCHED THEN
  UPDATE SET
    target.descricao = source.descricao,
    target.ordem = source.ordem,
    target.ativo = 1
WHEN NOT MATCHED THEN
  INSERT (nome, descricao, ordem, ativo)
  VALUES (source.nome, source.descricao, source.ordem, 1);
GO

;WITH source_telas AS (
  SELECT
    v.modulo_nome,
    v.nome,
    v.chave,
    v.rota,
    v.ordem
  FROM (VALUES
    (N'Administracao', N'Usuarios', N'usuarios', N'/usuarios', 1),
    (N'Administracao', N'Perfis', N'perfis', N'/perfis', 2),
    (N'Administracao', N'Permissoes', N'permissoes', N'/permissoes', 3),
    (N'Equipamentos', N'Equipamentos', N'equipamentos', N'/equipamentos', 1),
    (N'Obras', N'Obras', N'obras', N'/obras', 1),
    (N'Calibracoes', N'Calibracoes', N'calibracoes', N'/calibracoes', 1),
    (N'Relatorios', N'Relatorios', N'relatorios', N'/relatorios', 1)
  ) v(modulo_nome, nome, chave, rota, ordem)
),
source_telas_com_modulo AS (
  SELECT
    m.id_modulo,
    st.nome,
    st.chave,
    st.rota,
    st.ordem
  FROM source_telas st
  INNER JOIN app.modulo m
    ON m.nome = st.modulo_nome
)
MERGE app.tela AS target
USING source_telas_com_modulo AS source
ON target.chave = source.chave
WHEN MATCHED THEN
  UPDATE SET
    target.id_modulo = source.id_modulo,
    target.nome = source.nome,
    target.rota = source.rota,
    target.ordem = source.ordem,
    target.ativo = 1
WHEN NOT MATCHED THEN
  INSERT (id_modulo, nome, chave, rota, ordem, ativo)
  VALUES (source.id_modulo, source.nome, source.chave, source.rota, source.ordem, 1);
GO

;WITH perfis_alvo AS (
  SELECT id_perfil, nome
  FROM auth.perfil
  WHERE nome IN (N'Administrador', N'Calibrador', N'Operacional', N'Consulta')
),
telas_alvo AS (
  SELECT id_tela, chave
  FROM app.tela
  WHERE chave IN (
    N'usuarios',
    N'perfis',
    N'permissoes',
    N'equipamentos',
    N'obras',
    N'calibracoes',
    N'relatorios'
  )
),
matriz AS (
  SELECT
    p.id_perfil,
    t.id_tela,
    CAST(
      CASE
        WHEN p.nome = N'Administrador' THEN 1
        WHEN p.nome = N'Consulta' THEN 1
        WHEN p.nome = N'Calibrador' THEN 1
        WHEN p.nome = N'Operacional' AND t.chave IN (N'equipamentos', N'obras', N'calibracoes', N'relatorios') THEN 1
        ELSE 0
      END
      AS BIT
    ) AS pode_visualizar,
    CAST(
      CASE
        WHEN p.nome = N'Administrador' THEN 1
        WHEN p.nome = N'Calibrador' AND t.chave = N'calibracoes' THEN 1
        WHEN p.nome = N'Operacional' AND t.chave IN (N'equipamentos', N'obras', N'calibracoes') THEN 1
        ELSE 0
      END
      AS BIT
    ) AS pode_cadastrar,
    CAST(
      CASE
        WHEN p.nome = N'Administrador' THEN 1
        WHEN p.nome = N'Calibrador' AND t.chave = N'calibracoes' THEN 1
        WHEN p.nome = N'Operacional' AND t.chave IN (N'equipamentos', N'obras', N'calibracoes') THEN 1
        ELSE 0
      END
      AS BIT
    ) AS pode_editar,
    CAST(
      CASE
        WHEN p.nome = N'Administrador' THEN 1
        WHEN p.nome = N'Operacional' AND t.chave IN (N'equipamentos', N'obras', N'calibracoes') THEN 1
        ELSE 0
      END
      AS BIT
    ) AS pode_excluir,
    CAST(
      CASE
        WHEN p.nome = N'Administrador' THEN 1
        ELSE 0
      END
      AS BIT
    ) AS pode_configurar
  FROM perfis_alvo p
  CROSS JOIN telas_alvo t
)
MERGE auth.perfil_permissao AS target
USING matriz AS source
ON target.id_perfil = source.id_perfil
AND target.id_tela = source.id_tela
WHEN MATCHED THEN
  UPDATE SET
    target.pode_visualizar = source.pode_visualizar,
    target.pode_cadastrar = source.pode_cadastrar,
    target.pode_editar = source.pode_editar,
    target.pode_excluir = source.pode_excluir,
    target.pode_configurar = source.pode_configurar
WHEN NOT MATCHED THEN
  INSERT (
    id_perfil,
    id_tela,
    pode_visualizar,
    pode_cadastrar,
    pode_editar,
    pode_excluir,
    pode_configurar
  )
  VALUES (
    source.id_perfil,
    source.id_tela,
    source.pode_visualizar,
    source.pode_cadastrar,
    source.pode_editar,
    source.pode_excluir,
    source.pode_configurar
  );
GO
