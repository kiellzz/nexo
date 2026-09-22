alter table public.captacao
  add constraint captacao_equity_oferecido_maximo
  check (percentual_equity_oferecido > 0 and percentual_equity_oferecido <= 49.9);
