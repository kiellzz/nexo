create table if not exists public.startup_segmento (
  startup_id bigint not null references public.startup(id) on delete cascade,
  segmento_id bigint not null references public.segmento(id) on delete cascade,
  primary key (startup_id, segmento_id)
);

comment on table public.startup_segmento is
  'Secondary segments associated with a startup. The primary segment remains startup.segmento_id.';

update public.segmento set nome = 'Finanças' where id = 1;
update public.segmento set nome = 'Saúde' where id = 2;
update public.segmento set nome = 'Educação' where id = 3;
update public.segmento set nome = 'Agricultura' where id = 4;
update public.segmento set nome = 'Logística' where id = 5;
update public.segmento set nome = 'Energia e sustentabilidade' where id = 6;
update public.segmento set nome = 'Alimentação' where id = 7;
update public.segmento set nome = 'Varejo' where id = 8;
update public.segmento set nome = 'Governo e impacto social' where id = 9;
update public.segmento set nome = 'Software e serviços digitais' where id = 10;
