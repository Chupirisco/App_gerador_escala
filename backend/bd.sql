create database bd_escala;
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
    foreign key (id_esd_fk) references escala_dia (id_esd) on delete cascade,
    foreign key (id_fun_fk) references funcao (id_fun) on delete cascade,
    foreign key (id_ind_fk) references individuo (id_ind)
);

create index idx_indp_individuo_data on indisponibilidade (id_ind_fk, data_indp);
create index idx_escala_dia_data on escala_dia(data_esd);
create index idx_resultado_escala on escala_resultado (id_esd_fk);

select * from escala_dia;
select * from escala_dia_funcao;

select * from escala_resultado;

-- Todas as escalas do mês e os resultados já atribuídos
SELECT
    er.id_esr,
    er.id_ind_fk,
    i.nome_ind,
    i.nivel_ind,
    e.id_esd,
    e.data_esd,
    e.horario_esd,
    ef.id_fun_fk,
    f.nome_fun,
    f.nivel_fun
FROM escala_resultado er
JOIN individuo i ON i.id_ind = er.id_ind_fk
JOIN escala_dia e ON e.id_esd = er.id_esd_fk
JOIN escala_dia_funcao ef ON ef.id_esd_fk = e.id_esd
JOIN funcao f ON f.id_fun = ef.id_fun_fk
WHERE MONTH(e.data_esd) = 1 AND YEAR(e.data_esd) = 2026
ORDER BY e.data_esd, f.nivel_fun;

DELETE FROM escala_resultado;

INSERT INTO individuo (nome_ind, status_ind, nivel_ind, id_loc_fk) VALUES
-- 14 Experientes
('Danilo', 'ativo', 'experiente', 1),
('Juan Pereira', 'ativo', 'experiente', 1),
('Yuri', 'ativo', 'experiente', 1),
('Emanuel Prata', 'ativo', 'experiente', 1),
('Donato', 'ativo', 'experiente', 1),
('Felipe', 'ativo', 'experiente', 1),
('Elcir Freitas', 'ativo', 'experiente', 1),
('Max William', 'ativo', 'experiente', 1),
('Jose Carlos', 'ativo', 'experiente', 1),
('Gustavo Daniel', 'ativo', 'experiente', 1),
('João Gabriel', 'ativo', 'experiente', 1),
('Anthony Eduardo', 'ativo', 'experiente', 1),
('Eduardo Paiva', 'ativo', 'experiente', 1),
('Mateus', 'ativo', 'experiente', 1),

-- 14 Intermediários
('Clistenis', 'ativo', 'intermediario', 1),
('Wallison Francisco', 'ativo', 'intermediario', 1),
('Adrian', 'ativo', 'intermediario', 1),
('Alan', 'ativo', 'intermediario', 1),
('Diego', 'ativo', 'intermediario', 1),
('Thallysson', 'ativo', 'intermediario', 1),
('Luis Otavio', 'ativo', 'intermediario', 1),
('Ycaro', 'ativo', 'intermediario', 1),
('Gustavo', 'ativo', 'intermediario', 1),
('Guilherme', 'ativo', 'intermediario', 1),
('João Vitor', 'ativo', 'intermediario', 1),
('Gabriel Alves', 'ativo', 'intermediario', 1),
('Otavio Camatta', 'ativo', 'intermediario', 1),
('Juliano Kogiso', 'ativo', 'intermediario', 1),

-- 14 Novatos
('Eduardo', 'ativo', 'novato', 1),
('Kawan', 'ativo', 'novato', 1),
('Pablo Kauã', 'ativo', 'novato', 1),
('Murilo Mendes', 'ativo', 'novato', 1),
('Henrique camilo', 'ativo', 'novato', 1),
('Dhiakes', 'ativo', 'novato', 1),
('Erick Henrique', 'ativo', 'novato', 1),
('Mateus', 'ativo', 'novato', 1),
('Joao Paulo', 'ativo', 'novato', 1),
('Anthony Vieira', 'ativo', 'novato', 1),
('Donatinho', 'ativo', 'novato', 1),
('Thallysson', 'ativo', 'novato', 1),
('Juan Pedro', 'ativo', 'novato', 1),
('Otavio Camatta', 'ativo', 'novato', 1);
