CREATE DATABASE IF NOT EXISTS franquia;

USE franquia;

CREATE TABLE IF NOT EXISTS franqueado(
    franqueado_id INT PRIMARY KEY AUTO_INCREMENT,
    franqueado_nome VARCHAR(100) NOT NULL,
    franqueado_endereco VARCHAR(100) NOT NULL,
    franqueado_telefone VARCHAR(20) NOT NULL,
    franqueado_cpf VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS idioma(
    idioma_id INT PRIMARY KEY AUTO_INCREMENT,
    idioma_nome VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS franquia(
    franquia_id INT PRIMARY KEY AUTO_INCREMENT,
    franquia_nome VARCHAR(100) NOT NULL,
    franquia_endereco VARCHAR(100) NOT NULL,
    franquia_telefone VARCHAR(20) NOT NULL,
    franquia_franqueado_id INT NOT NULL,
    CONSTRAINT frqdo_fk FOREIGN KEY (franquia_franqueado_id) REFERENCES franqueado(franqueado_id)
);

CREATE TABLE IF NOT EXISTS curso(
    curso_id INT PRIMARY KEY AUTO_INCREMENT,
    curso_nome VARCHAR(100) NOT NULL,
    curso_nivel ENUM("iniciante", "intermediario", "avançado") NOT NULL,
    curso_idioma_id INT NOT NULL,
    CONSTRAINT crs_idma_fk FOREIGN KEY (curso_idioma_id) REFERENCES idioma(idioma_id)
);

CREATE TABLE IF NOT EXISTS franquia_curso(
    franquia_curso_id INT PRIMARY KEY AUTO_INCREMENT,
    franquia_curso_franquia_id INT NOT NULL,
    franquia_curso_curso_id INT NOT NULL,
    CONSTRAINT fc_uq UNIQUE (franquia_curso_curso_id, franquia_curso_franquia_id),
    CONSTRAINT fc_frq_fk FOREIGN KEY (franquia_curso_franquia_id) REFERENCES franquia(franquia_id),
    CONSTRAINT fc_crs_fk FOREIGN KEY (franquia_curso_curso_id) REFERENCES curso(curso_id)
);

CREATE TABLE IF NOT EXISTS aluno(
    aluno_id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_nome VARCHAR(100) NOT NULL,
    aluno_endereco VARCHAR(100),
    aluno_telefone VARCHAR(20),
    aluno_data_nascimento DATE,
    aluno_cpf CHAR(11) NOT NULL UNIQUE,
    aluno_email VARCHAR(50) NOT NULL UNIQUE,
    aluno_senha_hash VARCHAR(150) NOT NULL,
    aluno_franquia_id INT NOT NULL,
    CONSTRAINT al_frq_fk FOREIGN KEY (aluno_franquia_id) REFERENCES franquia(franquia_id)
);

CREATE TABLE IF NOT EXISTS professor(
    professor_id INT PRIMARY KEY AUTO_INCREMENT,
    professor_nome VARCHAR(100) NOT NULL,
    professor_telefone VARCHAR(20),
    professor_email VARCHAR(50) NOT NULL,
    professor_senha_hash VARCHAR(150) NOT NULL,
    professor_cpf VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS professor_cursofranquia(
    professor_cursofranquia_professor_id INT NOT NULL,
    professor_cursofranquia_franquia_curso_id INT NOT NULL,
    CONSTRAINT PRIMARY KEY(professor_cursofranquia_professor_id, professor_cursofranquia_franquia_curso_id),
    CONSTRAINT pcf_prf_fk FOREIGN KEY (professor_cursofranquia_professor_id) REFERENCES professor(professor_id),
    CONSTRAINT pcf_crf_fk FOREIGN KEY (professor_cursofranquia_franquia_curso_id) REFERENCES franquia_curso(franquia_curso_id)
);

CREATE TABLE IF NOT EXISTS professor_idioma(
    professor_idioma_professor_id INT NOT NULL,
    professor_idioma_idioma_id INT NOT NULL,
    CONSTRAINT PRIMARY KEY(professor_idioma_professor_id, professor_idioma_idioma_id),
    CONSTRAINT prf_idma_prf_fk FOREIGN KEY (professor_idioma_professor_id) REFERENCES professor(professor_id),
    CONSTRAINT prf_idma_idma_fk FOREIGN KEY (professor_idioma_idioma_id) REFERENCES idioma(idioma_id)
);

CREATE TABLE IF NOT EXISTS aula(
    aula_id INT PRIMARY KEY AUTO_INCREMENT,
    aula_data DATE NOT NULL,
    aula_local VARCHAR(100),
    aula_status ENUM("programada", "realizada", "cancelada") NOT NULL,
    aula_franquia_curso_id INT NOT NULL,
    aula_professor_id INT NOT NULL,
    CONSTRAINT aul_prof_fk FOREIGN KEY (aula_professor_id) REFERENCES professor(professor_id),
    CONSTRAINT aul_frq_crs_fk FOREIGN KEY (aula_franquia_curso_id) REFERENCES franquia_curso(franquia_curso_id)
);

CREATE TABLE IF NOT EXISTS matricula(
    matricula_id INT PRIMARY KEY AUTO_INCREMENT,
    matricula_status ENUM("ativa", "inativa") NOT NULL,
    matricula_data DATE NOT NULL,
    matricula_aluno_id INT NOT NULL,
    matricula_curso_franquia_id INT NOT NULL,
    CONSTRAINT mtr_aln_fk FOREIGN KEY (matricula_aluno_id) REFERENCES aluno(aluno_id),
    CONSTRAINT mtr_crs_frq_fk FOREIGN KEY (matricula_curso_franquia_id) REFERENCES franquia_curso(franquia_curso_id)
);

CREATE TABLE IF NOT EXISTS pagamento(
    pagamento_id INT PRIMARY KEY AUTO_INCREMENT,
    pagamento_valor DECIMAL(8, 2) NOT NULL,
    pagamento_data DATETIME NOT NULL,
    pagamento_metodo ENUM("crédito", "débito", "boleto"),
    pagamento_status ENUM("pendente", "pago") NOT NULL,
    pagamento_matricula_id INT NOT NULL,
    CONSTRAINT pgt_sts_ck CHECK(pagamento_status="pendente" OR (pagamento_status="pago" AND pagamento_metodo IS NOT NULL)),
    CONSTRAINT pgt_mtr_fk FOREIGN KEY (pagamento_matricula_id) REFERENCES matricula(matricula_id)
);

CREATE TABLE IF NOT EXISTS avaliacao(
    avaliacao_id INT PRIMARY KEY AUTO_INCREMENT,
    avaliacao_nota DECIMAL(3, 1) NOT NULL,
    avaliacao_descricao VARCHAR(500),
    avaliacao_data DATETIME NOT NULL,
    avaliacao_matricula_id INT NOT NULL,
    CONSTRAINT avl_mtr_fk FOREIGN KEY (avaliacao_matricula_id) REFERENCES matricula(matricula_id)
);

CREATE USER IF NOT EXISTS 'aplicacao'@'localhost' IDENTIFIED BY 'Senha123@';
GRANT ALL ON franquia.* TO 'aplicacao'@'localhost';


-- dados de exemplo

INSERT INTO 
    franqueado(
        franqueado_nome,
        franqueado_endereco,
        franqueado_telefone,
        franqueado_cpf
    )
    VALUES
    (
        "Carlos",
        "Rua das Frutas",
        "11493850493824",
        "10493827485"
    );

INSERT INTO
    franquia(
        franquia_nome,
        franquia_endereco,
        franquia_telefone,
        franquia_franqueado_id
    )
    VALUES
    (
        "Franquia Vila Césamo",
        "Rua das Oliveiras Nº 45",
        "11495834809",
        1
    );

INSERT INTO 
    aluno(
        aluno_nome, 
        aluno_endereco, 
        aluno_telefone, 
        aluno_data_nascimento, 
        aluno_cpf,
        aluno_email,
        aluno_senha_hash,
        aluno_franquia_id
    ) 
    VALUES 
    (
        "Aluno de Teste",
        "Rua Joaquim de Freitas Nº 64",
        "1194832049584",
        "2003-01-05",
        "11111111111",
        "teste@teste.com",
        "$2b$10$PQLhxljGJ9SXBrAuM5ft1.Xn.vsGOYIPpGu9KWBqpFTtTF/O92SIq",
        1
    );

INSERT INTO 
    professor(
        professor_nome, 
        professor_telefone,
        professor_email,
        professor_senha_hash,
        professor_cpf
    )
    VALUES
    (
        "Fernando Guedes",
        "1139485720394",
        "profteste@teste.com",
        "$2b$10$6bBYFIl3Wp.hCVdLEAMR5.WZKT3ELDryfjNBTNUJSMGGmW5X/BhHy",
        "39483720495"
    );
    
INSERT INTO
    idioma(
        idioma_nome
    )
    VALUES
    (
        "inglês"
    );

INSERT INTO 
    curso(
        curso_nome,
        curso_nivel,
        curso_idioma_id
    )
    VALUES
    (
        "Curso de Inglês",
        "iniciante",
        1
    );

INSERT INTO 
    franquia_curso(
        franquia_curso_franquia_id,
        franquia_curso_curso_id
    )
    VALUES
    (
        1,
        1
    );

INSERT INTO 
    aula(
        aula_data,
        aula_local,
        aula_status,
        aula_franquia_curso_id,
        aula_professor_id
    )
    VALUES
    (
        "2023-11-29",
        "Auditório Maurício de Souza",
        "programada",
        1,
        1
    );

INSERT INTO
    matricula(
        matricula_status,
        matricula_data,
        matricula_aluno_id,
        matricula_curso_franquia_id
    )
    VALUES
    (
        "ativa",
        "2023-09-01",
        1,
        1
    );

INSERT INTO 
    avaliacao(
        avaliacao_nota,
        avaliacao_descricao,
        avaliacao_data,
        avaliacao_matricula_id
    )
    VALUES
    (
        4.5,
        "Prova Bimestral",
        "2023-11-03T18:00:00.000",
        1
    ),
    (
        2.0,
        "Prova de Recuperação",
        "2023-11-06T18:00:00.000",
        1
    ),
    (
        1.0,
        "Prova de Teste",
        "2023-11-04T18:00:00.000",
        1
    ),
    (
        3.3,
        "Avaliação Final",
        "2023-11-05T18:00:00.000",
        1
    );

INSERT INTO
    pagamento(
        pagamento_valor,
        pagamento_data,
        pagamento_metodo,
        pagamento_status,
        pagamento_matricula_id
    )
    VALUES
    (
        301.50,
        "2023-11-21T17:00:00",
        NULL,
        "pendente",
        1
    ),
    (
        450.30,
        "2023-11-15T13:00:00",
        "boleto",
        "pago",
        1
    ),
    (
        480.30,
        "2023-11-30T14:00:00",
        NULL,
        "pendente",
        1
    );

INSERT INTO 
    professor_cursofranquia(
        professor_cursofranquia_professor_id,
        professor_cursofranquia_franquia_curso_id
    )
    VALUES
    (
        1,
        1
    );

INSERT INTO 
    professor_idioma(
        professor_idioma_professor_id,
        professor_idioma_idioma_id
    )
    VALUES
    (
        1,
        1
    );