CREATE DATABASE IF NOT EXISTS franquia;

USE franquia;

CREATE TABLE IF NOT EXISTS lingua(
	lingua_id INT PRIMARY KEY AUTO_INCREMENT,
    lingua_nome VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS franqueado(
	franqueado_id INT PRIMARY KEY AUTO_INCREMENT,
    franqueado_nome VARCHAR(100) NOT NULL,
    franqueado_data_nascimento DATE,
    franqueado_telefone CHAR(11) NOT NULL
);

CREATE TABLE IF NOT EXISTS franquia(
	franquia_id INT PRIMARY KEY AUTO_INCREMENT,
    franquia_nome VARCHAR(100) NOT NULL,
    franquia_endereco VARCHAR(200) NOT NULL,
    franquia_telefone CHAR(20) NOT NULL,
    franquia_franqueado_id INT NOT NULL,
    CONSTRAINT frqdo_uq UNIQUE (franquia_franqueado_id),
    CONSTRAINT frqdo_fk FOREIGN KEY (franquia_franqueado_id) REFERENCES franqueado(franqueado_id)
);

CREATE TABLE IF NOT EXISTS curso(
	curso_id INT PRIMARY KEY AUTO_INCREMENT,
    curso_nome VARCHAR(100) NOT NULL,
    curso_lingua_id INT NOT NULL,
    curso_nivel ENUM("iniciante", "intermediario", "avançado") NOT NULL,
    CONSTRAINT crso_fk FOREIGN KEY (curso_lingua_id) REFERENCES lingua(lingua_id)
);

CREATE TABLE IF NOT EXISTS franquia_curso(
	franquia_curso_id INT PRIMARY KEY AUTO_INCREMENT,
    franquia_id INT NOT NULL,
    curso_id INT NOT NULL,
    CONSTRAINT fq_fk FOREIGN KEY (franquia_id) REFERENCES franquia(franquia_id),
    CONSTRAINT cr_fk FOREIGN KEY (curso_id) REFERENCES curso(curso_id),
    CONSTRAINT fq_uq UNIQUE (franquia_id, curso_id)
);

CREATE TABLE IF NOT EXISTS aluno(
	aluno_id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_nome VARCHAR(100) NOT NULL,
    aluno_endereco VARCHAR(200) NOT NULL,
    aluno_telefone CHAR(11),
    aluno_cpf CHAR(11) NOT NULL UNIQUE,
    aluno_email VARCHAR(50) NOT NULL UNIQUE,
    aluno_senha_hash VARCHAR(100) NOT NULL,
    aluno_data_nascimento DATE,
    aluno_franquia_id INT NOT NULL,
    CONSTRAINT frqia_fk FOREIGN KEY (aluno_franquia_id) REFERENCES franquia(franquia_id)
);

CREATE TABLE IF NOT EXISTS professor(
	professor_id INT PRIMARY KEY AUTO_INCREMENT,
    professor_nome VARCHAR(100) NOT NULL,
    professor_telefone CHAR(11) NOT NULL,
    professor_senha_hash VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS professor_qualificacao(
	professor_id INT NOT NULL,
    lingua_id INT NOT NULL,
    CONSTRAINT prf_fk FOREIGN KEY (professor_id) REFERENCES professor(professor_id),
    CONSTRAINT lga_fk FOREIGN KEY (lingua_id) REFERENCES lingua(lingua_id),
    CONSTRAINT prf_ql_pk PRIMARY KEY (professor_id, lingua_id)
);

CREATE TABLE IF NOT EXISTS aula(
	aula_id INT PRIMARY KEY AUTO_INCREMENT,
    aula_horario DATETIME NOT NULL,
    aula_local VARCHAR(100) NOT NULL,
    aula_status ENUM("realizada", "cancelada"),
    aula_franquia_curso_id INT NOT NULL,
    CONSTRAINT fqcrso_fk FOREIGN KEY (aula_franquia_curso_id) REFERENCES franquia_curso(franquia_curso_id)
);

CREATE TABLE IF NOT EXISTS matricula(
	matricula_id INT PRIMARY KEY AUTO_INCREMENT,
    matricula_data DATE,
    matricula_status ENUM('ativa', 'inativa'),
    matricula_aluno_id INT NOT NULL,
    matricula_curso_franquia_id INT NOT NULL,
    CONSTRAINT aln_fk FOREIGN KEY (matricula_aluno_id) REFERENCES aluno(aluno_id),
    CONSTRAINT crs_frq_fk FOREIGN KEY (matricula_curso_franquia_id) REFERENCES franquia_curso(franquia_curso_id)
);

CREATE TABLE IF NOT EXISTS pagamento(
	pagamento_id INT PRIMARY KEY AUTO_INCREMENT,
    pagamento_valor DECIMAL(10, 2) NOT NULL,
    pagamento_data DATETIME,
    pagamento_metodo ENUM("crédito", "débito", "boleto") NOT NULL,
    pagamento_status ENUM("pendente", "pago", "atrasado") NOT NULL,
    pagamento_matricula_id INT NOT NULL,
    CONSTRAINT pgmt_fk FOREIGN KEY (pagamento_matricula_id) REFERENCES matricula(matricula_id)
);

CREATE TABLE IF NOT EXISTS avaliacao(
	avaliacao_id INT PRIMARY KEY AUTO_INCREMENT,
    avaliacao_nota DECIMAL(3, 1) NOT NULL,
    avaliacao_data DATETIME,
    avaliacao_matricula_id INT NOT NULL,
    CONSTRAINT avl_mtr_fk FOREIGN KEY (avaliacao_matricula_id) REFERENCES matricula(matricula_id)
);


CREATE USER IF NOT EXISTS 'aplicacao'@'localhost' IDENTIFIED BY 'Senha123@';
GRANT ALL ON franquia.* TO 'aplicacao'@'localhost';





