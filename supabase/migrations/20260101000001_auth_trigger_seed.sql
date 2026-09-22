create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_tipo text := new.raw_user_meta_data ->> 'tipo';
  v_nome text := left(
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'nome'), ''), split_part(new.email, '@', 1)),
    100
  );
begin
  if v_tipo is null or v_tipo not in ('startup', 'investidor') then
    raise exception 'Cadastro inválido: metadado "tipo" deve ser startup ou investidor (recebido: %)', v_tipo;
  end if;

  insert into public.usuario (id, nome, tipo)
  values (new.id, v_nome, v_tipo::public.tipo_usuario);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.segmento (nome) values
  ('Finanças'), ('Saúde'), ('Educação'), ('Agricultura'), ('Logística'),
  ('Energia e sustentabilidade'), ('Alimentação'), ('Varejo'), ('Governo e impacto social'),
  ('Software e serviços digitais')
on conflict (nome) do nothing;
