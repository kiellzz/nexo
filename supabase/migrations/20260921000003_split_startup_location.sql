alter table public.startup
  add column if not exists cidade text,
  add column if not exists estado text;

comment on column public.startup.cidade is
  'Optional city where the startup is based.';

comment on column public.startup.estado is
  'Optional Brazilian state where the startup is based.';
