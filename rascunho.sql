USE loja;

CREATE TABLE IF NOT EXISTS venda(
    ven_id INT PRIMARY KEY AUTO_INCREMENT,
    ven_dt DATETIME,
    cli_id INT NOT NULL,
    met_pag_id INT NOT NULL,
    CONSTRAINT cli_fk FOREIGN KEY (cli_id) REFERENCES cliente(cli_id),
    CONSTRAINT met_pag_fk FOREIGN KEY (met_pag_id) REFERENCES metodo_pagamento(met_pag_id)
);

CREATE TABLE IF NOT EXISTS venda_items(
    ven_id INT NOT NULL,
    prod_id INT NOT NULL,
    ven_it_qtd INT NOT NULL,
    CONSTRAINT ven_ite_pk PRIMARY KEY (ven_id, prod_id),
    CONSTRAINT ven_fk FOREIGN KEY (ven_id) REFERENCES venda(ven_id),
    CONSTRAINT prod_fk FOREIGN KEY (prod_id) REFERENCES produto(prod_id)
);