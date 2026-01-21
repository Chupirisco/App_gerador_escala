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
    foreign key (id_esd_fk) references escala_dia(id_esd)    
);

create table escala_resultado(
	id_esr int primary key auto_increment,
    id_esd_fk int,
    id_fun_fk int,
    id_ind_fk int null,
    foreign key (id_esd_fk) references escala_dia (id_esd),
    foreign key (id_fun_fk) references funcao (id_fun),
    foreign key (id_ind_fk) references individuo (id_ind)
);

create index idx_indp_individuo_data on indisponibilidade (id_ind_fk, data_indp);
create index idx_escala_dia_data on escala_dia(data_esd);
create index idx_resultado_escala on escala_resultado (id_esd_fk);
