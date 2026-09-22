alter table public.startup
  add column if not exists data_fundacao date;

comment on column public.startup.data_fundacao is
  'Optional startup founding date. The UI collects month and year.';