alter table public.startup
  add column if not exists linkedin_url text,
  add column if not exists linkedin_visivel boolean not null default true;

alter table public.investidor
  add column if not exists linkedin_url text,
  add column if not exists linkedin_visivel boolean not null default true;

comment on column public.startup.linkedin_visivel is
  'Whether the startup LinkedIn URL may be shown in the details modal.';

comment on column public.investidor.linkedin_visivel is
  'Whether the investor LinkedIn URL may be shown in the details modal.';
