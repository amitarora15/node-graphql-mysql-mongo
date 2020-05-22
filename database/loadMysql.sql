create table content_partner
(
    cp_id      int auto_increment,
    first_name varchar(30)                         not null,
    last_name  varchar(30)                         not null,
    email      varchar(300)                        not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null,
    constraint content_partner_email_uindex
        unique (email),
    constraint user_id_uindex
        unique (cp_id)
);

create table movie
(
    movie_id    int auto_increment,
    name        varchar(200)                                     not null,
    genre       enum ('thriller', 'action', 'romance', 'comedy') null,
    ingested_by int                                              not null,
    ingested_on timestamp default CURRENT_TIMESTAMP              null,
    constraint movie_movie_id_uindex
        unique (movie_id)
);

alter table movie
    add primary key (movie_id);

create table `show`
(
    show_id       int auto_increment,
    title         varchar(300)                                     not null,
    no_of_seasons int       default 1                              null,
    genre         enum ('romance', 'action', 'thriller', 'comedy') null,
    ingested_by   int                                              not null,
    ingested_on   timestamp default CURRENT_TIMESTAMP              null,
    constraint show_show_id_uindex
        unique (show_id),
    constraint show_content_partner_cp_id_fk
        foreign key (ingested_by) references content_partner (cp_id)
);

alter table `show`
    add primary key (show_id);

insert into content_partner(first_name, last_name, email) values ('Yash','Raj','yash.raj@gmail.com');
insert into content_partner(first_name, last_name, email) values ('Balaji','Telefilm','balaji@gmail.com');

insert into movie(name, genre, ingested_by) values('Dhoom','action',(select cp_id from  content_partner where email='yash.raj@gmail.com'));
insert into movie(name, genre, ingested_by) values('PK','comedy',(select cp_id from  content_partner where email='yash.raj@gmail.com'));

insert into movie(name, genre, ingested_by) values('Udta Punjab','thriller',(select cp_id from  content_partner where email='balaji@gmail.com'));

insert into `show`(title, genre, ingested_by) values('Test Case','thriller',(select cp_id from  content_partner where email='balaji@gmail.com'));
insert into `show`(title, genre, ingested_by) values('Broken But Beautiful','romance',(select cp_id from content_partner where email='balaji@gmail.com'));
