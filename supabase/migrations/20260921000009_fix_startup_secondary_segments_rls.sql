alter table public.startup_segmento enable row level security;

drop policy if exists startup_segmento_select_authenticated on public.startup_segmento;
create policy startup_segmento_select_authenticated
on public.startup_segmento
for select
to authenticated
using (true);

drop policy if exists startup_segmento_insert_owner on public.startup_segmento;
create policy startup_segmento_insert_owner
on public.startup_segmento
for insert
to authenticated
with check (
  exists (
    select 1
    from public.startup
    where startup.id = startup_segmento.startup_id
      and startup.usuario_id = auth.uid()
  )
);

drop policy if exists startup_segmento_delete_owner on public.startup_segmento;
create policy startup_segmento_delete_owner
on public.startup_segmento
for delete
to authenticated
using (
  exists (
    select 1
    from public.startup
    where startup.id = startup_segmento.startup_id
      and startup.usuario_id = auth.uid()
  )
);
