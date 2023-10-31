CREATE DATABASE IF NOT EXISTS franquia;

USE franquia;

CREATE TABLE IF NOT EXISTS franqueado(
	franqueado_id INT PRIMARY KEY AUTO_INCREMENT,
    franqueado_nome VARCHAR(100) NOT NULL,
    franqueado_data_nascimento DATE
);

CREATE TABLE IF NOT EXISTS aluno(
	aluno_id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_nome VARCHAR(100) NOT NULL,
    aluno_endereco VARCHAR(200) NOT NULL,
    aluno_telefone CHAR(11),
    aluno_email VARCHAR(50) NOT NULL UNIQUE,
    aluno_data_nascimento DATE
);

CREATE TABLE IF NOT EXISTS professor(
	professor_id INT PRIMARY KEY AUTO_INCREMENT,
);

CREATE TABLE IF NOT EXISTS curso(
	curso_id INT PRIMARY KEY AUTO_INCREMENT,
    curso_nome VARCHAR(100) NOT NULL,
    curso_lingua_ensinada ENUM("português", "espanhol", "inglês", "russo", "italiano") NOT NULL,
    curso_nivel ENUM("iniciante", "intermediario", "avançado") NOT NULL
);

CREATE TABLE IF NOT EXISTS franquia(
	franquia_id INT PRIMARY KEY AUTO_INCREMENT,
    franquia_nome VARCHAR(100) NOT NULL,
    franquia_endereço VARCHAR(200) NOT NULL,
    franquia_telefone CHAR(20) NOT NULL,
    franqueado_id INT NOT NULL,
    CONSTRAINT frqdo_fk FOREIGN KEY (franqueado_id) REFERENCES franqueado(franqueado_id)
);

/*
	Fomos contratados para atender às necessidades da 'Global Speaking School', uma escola de idiomas de destaque, que busca aprimorar sua eficiência e gestão por meio de um sistema de banco de dados personalizado. Este projeto visa simplificar o acompanhamento de alunos, cursos e professores, ao mesmo tempo em que mantém registros detalhados para a administração acadêmica e financeira. Vamos explorar os requisitos detalhados e desenvolver uma estrutura de banco de dados que atenda às necessidades da escola, com a certeza de que estamos comprometidos com o sucesso deste empreendimento.
•	Registre informações sobre cada franquia da rede "Global Speaking School”, incluindo nome da franquia, endereço, informações de contato e dados do franqueado responsável.
•	O banco de dados deve armazenar informações sobre os alunos matriculados em cada franquia. Isso inclui nome, endereço, número de telefone, e-mail e data de nascimento. um aluno pode se inscrever em várias aulas de um curso e uma aula pode ter vários alunos inscritos.
•	Cada franquia oferece vários cursos de idiomas. Os detalhes de cada curso devem ser registrados, incluindo o nome do curso, língua ensinada, nível (iniciante, intermediário, avançado), horário e local das aulas, bem como o professor responsável.
•	Os alunos se matriculam em cursos específicos em uma franquia específica. É necessário rastrear quais alunos estão matriculados em quais cursos, a data de matrícula e o status da matrícula (ativa, inativa).
•	Mantenha um registro de todos os pagamentos feitos pelos alunos em cada franquia, incluindo o valor, data do pagamento, método de pagamento e status (pendente, pago, atrasado)
•	Registre informações sobre os professores que ministram os cursos em cada franquia, incluindo nome, informações de contato e informações sobre qualificação.
•	Acompanhe as aulas programadas para cada curso em cada franquia, incluindo datas, horários, local e status (realizada, cancelada).
•	Registre as notas e avaliações dos alunos em seus cursos em cada franquia para acompanhamento do desempenho.
*/