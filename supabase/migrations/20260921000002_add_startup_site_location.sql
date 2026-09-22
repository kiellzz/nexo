alter table public.startup
  add column if not exists site_url text,
  add column if not exists localizacao text,
  add column if not exists latitude double precision,
  add column if not exists longitude double precision;

comment on column public.startup.site_url is
  'Optional public website URL for the startup.';

comment on column public.startup.localizacao is
  'Optional public location label such as city and state.';

comment on column public.startup.latitude is
  'Optional latitude provided with the startup location permission.';

comment on column public.startup.longitude is
  'Optional longitude provided with the startup location permission.';
