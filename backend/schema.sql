use bd_escala;

create table local(
	id_loc int primary key auto_increment,
    nome_loc varchar(200)
);

create table funcao(
	id_fun int primary key auto_increment,
    nome_fun varchar(200),    
    nivel_fun varchar(20)
);

create table individuo(
	id_ind int primary key auto_increment,
    nome_ind varchar(200),
    status_ind varchar(20),
    nivel_ind varchar(20),
    id_loc_fk int null,
    foreign key (id_loc_fk) references local(id_loc)
);

create table indisponibilidade(
	id_indp int primary key auto_increment,
    data_indp date,
    id_ind_fk int,
    foreign key (id_ind_fk) references individuo (id_ind)
);

create table escala_dia(
	id_esd int primary key auto_increment,
    data_esd date,
    horario_esd time,
    id_loc_fk int,
    lote_escala_esd varchar(36),
    foreign key (id_loc_fk) references local(id_loc) 
);

# pega a função e coloca uma quantidade maxima de pessoas escaladas para ela
create table escala_dia_funcao(
	id_edf int primary key auto_increment,
    quantidade int,
    id_fun_fk int,
    id_esd_fk int,
    foreign key (id_fun_fk) references funcao(id_fun),
    foreign key (id_esd_fk) references escala_dia(id_esd) on delete cascade 
);

create table escala_resultado(
	id_esr int primary key auto_increment,
    id_esd_fk int,
    id_fun_fk int,
    id_ind_fk int null,
    lote_escala_esr varchar(36) not null,
    foreign key (id_esd_fk) references escala_dia (id_esd) on delete cascade,
    foreign key (id_fun_fk) references funcao (id_fun) on delete cascade,
    foreign key (id_ind_fk) references individuo (id_ind)
);

create index idx_indp_individuo_data on indisponibilidade (id_ind_fk, data_indp);
create index idx_escala_dia_data on escala_dia(data_esd);
create index idx_resultado_escala on escala_resultado (id_esd_fk);
create index idx_lote_escala on escala_resultado(lote_escala_esr);

/*
-- Inserindo dados na tabela local
INSERT INTO local (nome_loc) VALUES ('Hospital Central');
INSERT INTO local (nome_loc) VALUES ('Posto de Saúde Zona Norte');

-- Inserindo dados na tabela funcao
INSERT INTO funcao (nome_fun, nivel_fun) VALUES ('Enfermeiro', 'Junior');
INSERT INTO funcao (nome_fun, nivel_fun) VALUES ('Médico', 'Senior');

-- Inserindo dados na tabela individuo
INSERT INTO individuo (nome_ind, status_ind, nivel_ind, id_loc_fk) 
VALUES ('Carlos Silva', 'Ativo', 'Junior', 1);
INSERT INTO individuo (nome_ind, status_ind, nivel_ind, id_loc_fk) 
VALUES ('Maria Souza', 'Ativo', 'Senior', 2);

-- Inserindo dados na tabela indisponibilidade
INSERT INTO indisponibilidade (data_indp, id_ind_fk) VALUES ('2026-02-10', 1);
INSERT INTO indisponibilidade (data_indp, id_ind_fk) VALUES ('2026-02-15', 2);

-- Inserindo dados na tabela escala_dia
INSERT INTO escala_dia (data_esd, horario_esd, id_loc_fk) VALUES ('2026-02-12', '08:00:00', 1);
INSERT INTO escala_dia (data_esd, horario_esd, id_loc_fk) VALUES ('2026-02-12', '14:00:00', 2);

-- Inserindo dados na tabela escala_dia_funcao
INSERT INTO escala_dia_funcao (quantidade, id_fun_fk, id_esd_fk) VALUES (3, 1, 1);
INSERT INTO escala_dia_funcao (quantidade, id_fun_fk, id_esd_fk) VALUES (2, 2, 2);

-- Inserindo dados na tabela escala_resultado
INSERT INTO escala_resultado (id_esd_fk, id_fun_fk, id_ind_fk, lote_escala_esr) 
VALUES (1, 1, 1, '123e4567-e89b-12d3-a456-426614174000');
INSERT INTO escala_resultado (id_esd_fk, id_fun_fk, id_ind_fk, lote_escala_esr) 
VALUES (2, 2, 2, '987e6543-e21b-12d3-a456-426614174111');

-- Inserindo mais locais
INSERT INTO local (nome_loc) VALUES ('UPA Zona Sul');
INSERT INTO local (nome_loc) VALUES ('Clínica Municipal');

-- Inserindo mais funções
INSERT INTO funcao (nome_fun, nivel_fun) VALUES ('Técnico de Enfermagem', 'Junior');
INSERT INTO funcao (nome_fun, nivel_fun) VALUES ('Recepcionista', 'Pleno');

-- Inserindo mais indivíduos
INSERT INTO individuo (nome_ind, status_ind, nivel_ind, id_loc_fk) 
VALUES ('João Pereira', 'Ativo', 'Junior', 1);
INSERT INTO individuo (nome_ind, status_ind, nivel_ind, id_loc_fk) 
VALUES ('Ana Costa', 'Ativo', 'Pleno', 3);

-- Inserindo indisponibilidades para os novos indivíduos
INSERT INTO indisponibilidade (data_indp, id_ind_fk) VALUES ('2026-02-11', 3);
INSERT INTO indisponibilidade (data_indp, id_ind_fk) VALUES ('2026-02-16', 4);

-- Inserindo mais escalas de dia
INSERT INTO escala_dia (data_esd, horario_esd, id_loc_fk) VALUES ('2026-02-13', '10:00:00', 3);
INSERT INTO escala_dia (data_esd, horario_esd, id_loc_fk) VALUES ('2026-02-13', '16:00:00', 4);

-- Inserindo mais escala_dia_funcao
INSERT INTO escala_dia_funcao (quantidade, id_fun_fk, id_esd_fk) VALUES (2, 3, 3);
INSERT INTO escala_dia_funcao (quantidade, id_fun_fk, id_esd_fk) VALUES (1, 4, 4);

-- Inserindo mais escala_resultado usando os mesmos lotes já existentes
-- Usando lote '123e4567-e89b-12d3-a456-426614174000'
INSERT INTO escala_resultado (id_esd_fk, id_fun_fk, id_ind_fk, lote_escala_esr) 
VALUES (3, 3, 3, '123e4567-e89b-12d3-a456-426614174000');

-- Usando lote '987e6543-e21b-12d3-a456-426614174111'
INSERT INTO escala_resultado (id_esd_fk, id_fun_fk, id_ind_fk, lote_escala_esr) 
VALUES (4, 4, 4, '987e6543-e21b-12d3-a456-426614174111');

-- Consulta resultados da escala com base no LOTE
SELECT 
    er.id_esr,
    er.lote_escala_esr,
    ed.data_esd,
    ed.horario_esd,
    l.nome_loc,
    f.nome_fun,
    f.nivel_fun,
    i.nome_ind,
    i.nivel_ind,
    i.status_ind
FROM escala_resultado er
JOIN escala_dia ed ON er.id_esd_fk = ed.id_esd
JOIN local l ON ed.id_loc_fk = l.id_loc
JOIN funcao f ON er.id_fun_fk = f.id_fun
LEFT JOIN individuo i ON er.id_ind_fk = i.id_ind
WHERE er.lote_escala_esr = '123e4567-e89b-12d3-a456-426614174000';*/

