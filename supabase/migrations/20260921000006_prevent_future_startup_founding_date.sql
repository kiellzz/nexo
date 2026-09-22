create or replace function public.validar_data_fundacao_startup()
returns trigger
language plpgsql
as $$
begin
  if new.data_fundacao is not null and new.data_fundacao > current_date then
    raise exception 'A data de fundacao da startup nao pode ser futura.';
  end if;

  return new;
end;
$$;

drop trigger if exists startup_data_fundacao_nao_futura on public.startup;

create trigger startup_data_fundacao_nao_futura
before insert or update of data_fundacao on public.startup
for each row
execute function public.validar_data_fundacao_startup();
