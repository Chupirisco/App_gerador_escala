create database bd_escala;
use bd_escala;


create table local(
	id_loc int primary key auto_increment,
    nome_loc varchar(200)
);

create table funcao(
	id_fun int primary key auto_increment,
    nome_fun varchar(200)
);

create table individuo(
	id_ind int primary key auto_increment,
    nome_ind varchar(200),
    status_ind varchar(20),
    id_loc_fk int null,
    foreign key (id_loc_fk) references local(id_loc)
);
select * from local;