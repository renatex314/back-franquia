CREATE TABLE IF NOT EXISTS franqueado(
    franqueado_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    franqueado_nome VARCHAR(100) NOT NULL,
    franqueado_endereco VARCHAR(100) NOT NULL,
    franqueado_telefone VARCHAR(20) NOT NULL,
    franqueado_cpf VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS idioma(
    idioma_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    idioma_nome VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS franquia(
    franquia_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    franquia_nome VARCHAR(100) NOT NULL,
    franquia_endereco VARCHAR(100) NOT NULL,
    franquia_telefone VARCHAR(20) NOT NULL,
    franquia_franqueado_id INT NOT NULL,
    CONSTRAINT frqdo_fk FOREIGN KEY (franquia_franqueado_id) REFERENCES franqueado(franqueado_id)
);

CREATE TYPE nivel AS ENUM('iniciante', 'intermediario', 'avançado');
CREATE TABLE IF NOT EXISTS curso(
    curso_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    curso_nome VARCHAR(100) NOT NULL,
    curso_nivel nivel NOT NULL,
    curso_idioma_id INT NOT NULL,
    CONSTRAINT crs_idma_fk FOREIGN KEY (curso_idioma_id) REFERENCES idioma(idioma_id)
);

CREATE TABLE IF NOT EXISTS franquia_curso(
    franquia_curso_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    franquia_curso_franquia_id INT NOT NULL,
    franquia_curso_curso_id INT NOT NULL,
    CONSTRAINT fc_uq UNIQUE (franquia_curso_curso_id, franquia_curso_franquia_id),
    CONSTRAINT fc_frq_fk FOREIGN KEY (franquia_curso_franquia_id) REFERENCES franquia(franquia_id),
    CONSTRAINT fc_crs_fk FOREIGN KEY (franquia_curso_curso_id) REFERENCES curso(curso_id)
);

CREATE TABLE IF NOT EXISTS aluno(
    aluno_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
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
    professor_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    professor_nome VARCHAR(100) NOT NULL,
    professor_telefone VARCHAR(20),
    professor_email VARCHAR(50) NOT NULL,
    professor_senha_hash VARCHAR(150) NOT NULL,
    professor_cpf VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS professor_cursofranquia(
    professor_cursofranquia_professor_id INT NOT NULL,
    professor_cursofranquia_franquia_curso_id INT NOT NULL,
    PRIMARY KEY(professor_cursofranquia_professor_id, professor_cursofranquia_franquia_curso_id),
    CONSTRAINT pcf_prf_fk FOREIGN KEY (professor_cursofranquia_professor_id) REFERENCES professor(professor_id),
    CONSTRAINT pcf_crf_fk FOREIGN KEY (professor_cursofranquia_franquia_curso_id) REFERENCES franquia_curso(franquia_curso_id)
);

CREATE TABLE IF NOT EXISTS professor_idioma(
    professor_idioma_professor_id INT NOT NULL,
    professor_idioma_idioma_id INT NOT NULL,
    PRIMARY KEY(professor_idioma_professor_id, professor_idioma_idioma_id),
    CONSTRAINT prf_idma_prf_fk FOREIGN KEY (professor_idioma_professor_id) REFERENCES professor(professor_id),
    CONSTRAINT prf_idma_idma_fk FOREIGN KEY (professor_idioma_idioma_id) REFERENCES idioma(idioma_id)
);

CREATE TYPE aula_status_tipos AS ENUM('programada', 'realizada', 'cancelada');
CREATE TABLE IF NOT EXISTS aula(
    aula_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    aula_data DATE NOT NULL,
    aula_local VARCHAR(100),
    aula_status aula_status_tipos NOT NULL,
    aula_franquia_curso_id INT NOT NULL,
    aula_professor_id INT NOT NULL,
    CONSTRAINT aul_prof_fk FOREIGN KEY (aula_professor_id) REFERENCES professor(professor_id),
    CONSTRAINT aul_frq_crs_fk FOREIGN KEY (aula_franquia_curso_id) REFERENCES franquia_curso(franquia_curso_id)
);

CREATE TYPE matricula_status_tipos AS ENUM('ativa', 'inativa');
CREATE TABLE IF NOT EXISTS matricula(
    matricula_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    matricula_status matricula_status_tipos NOT NULL,
    matricula_data DATE NOT NULL,
    matricula_aluno_id INT NOT NULL,
    matricula_curso_franquia_id INT NOT NULL,
    CONSTRAINT mtr_aln_fk FOREIGN KEY (matricula_aluno_id) REFERENCES aluno(aluno_id),
    CONSTRAINT mtr_crs_frq_fk FOREIGN KEY (matricula_curso_franquia_id) REFERENCES franquia_curso(franquia_curso_id)
);

CREATE TYPE pagamento_metodo_tipos AS ENUM('crédito', 'débito', 'boleto');
CREATE TYPE pagamento_status_tipos AS ENUM('pendente', 'pago', 'atrasado');
CREATE TABLE IF NOT EXISTS pagamento(
    pagamento_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    pagamento_valor DECIMAL(8, 2) NOT NULL,
    pagamento_data TIMESTAMP NOT NULL,
    pagamento_metodo pagamento_metodo_tipos NOT NULL,
    pagamento_status pagamento_status_tipos NOT NULL,
    pagamento_matricula_id INT NOT NULL,
    CONSTRAINT pgt_mtr_fk FOREIGN KEY (pagamento_matricula_id) REFERENCES matricula(matricula_id)
);

CREATE TABLE IF NOT EXISTS avaliacao(
    avaliacao_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    avaliacao_nota DECIMAL(3, 1) NOT NULL,
    avaliacao_descricao VARCHAR(500),
    avaliacao_data TIMESTAMP NOT NULL,
    avaliacao_matricula_id INT NOT NULL,
    CONSTRAINT avl_mtr_fk FOREIGN KEY (avaliacao_matricula_id) REFERENCES matricula(matricula_id)
);

-- CREATE USER IF NOT EXISTS 'aplicacao'@'localhost' IDENTIFIED BY 'Senha123@';
-- GRANT ALL ON franquia.* TO 'aplicacao'@'localhost';



