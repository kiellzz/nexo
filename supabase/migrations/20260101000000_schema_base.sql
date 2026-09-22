--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA IF NOT EXISTS public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: status_match; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.status_match AS ENUM (
    'pendente',
    'aceito',
    'recusado'
);


--
-- Name: status_rodada; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.status_rodada AS ENUM (
    'aberta',
    'encerrada',
    'cancelada'
);


--
-- Name: tipo_usuario; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.tipo_usuario AS ENUM (
    'startup',
    'investidor'
);


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
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


--
-- Name: rls_auto_enable(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.rls_auto_enable() RETURNS event_trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: captacao; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.captacao (
    id bigint NOT NULL,
    startup_id bigint NOT NULL,
    valor_alvo numeric(15,2) NOT NULL,
    valor_captado numeric(15,2) DEFAULT 0 NOT NULL,
    percentual_equity_oferecido numeric(5,2) NOT NULL,
    status public.status_rodada DEFAULT 'aberta'::public.status_rodada NOT NULL,
    data_inicio date NOT NULL,
    data_fim date,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT captacao_datas_validas CHECK (((data_fim IS NULL) OR (data_fim >= data_inicio))),
    CONSTRAINT captacao_equity_oferecido_maximo CHECK (((percentual_equity_oferecido > (0)::numeric) AND (percentual_equity_oferecido <= 49.9))),
    CONSTRAINT captacao_percentual_equity_oferecido_check CHECK (((percentual_equity_oferecido > (0)::numeric) AND (percentual_equity_oferecido <= (100)::numeric))),
    CONSTRAINT captacao_valor_alvo_check CHECK ((valor_alvo > (0)::numeric)),
    CONSTRAINT captacao_valor_captado_check CHECK ((valor_captado >= (0)::numeric))
);


--
-- Name: captacao_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.captacao ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.captacao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: investidor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.investidor (
    id bigint NOT NULL,
    usuario_id uuid NOT NULL,
    nome character varying(100) NOT NULL,
    cpf character(11) NOT NULL,
    tipo character varying(30) NOT NULL,
    biografia character varying(500),
    ticket_min numeric(15,2),
    ticket_max numeric(15,2),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    linkedin_url text,
    CONSTRAINT investidor_cpf_check CHECK ((cpf ~ '^[0-9]{11}$'::text)),
    CONSTRAINT investidor_ticket_max_check CHECK ((ticket_max >= (0)::numeric)),
    CONSTRAINT investidor_ticket_min_check CHECK ((ticket_min >= (0)::numeric)),
    CONSTRAINT investidor_ticket_valido CHECK (((ticket_min IS NULL) OR (ticket_max IS NULL) OR (ticket_min <= ticket_max)))
);


--
-- Name: investidor_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.investidor ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.investidor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: investidor_segmento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.investidor_segmento (
    investidor_id bigint NOT NULL,
    segmento_id smallint NOT NULL
);


--
-- Name: match; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.match (
    id bigint NOT NULL,
    captacao_id bigint NOT NULL,
    investidor_id bigint NOT NULL,
    status public.status_match DEFAULT 'pendente'::public.status_match NOT NULL,
    valor_proposto numeric(15,2),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT match_valor_proposto_check CHECK ((valor_proposto > (0)::numeric))
);


--
-- Name: match_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.match ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.match_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: segmento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.segmento (
    id smallint NOT NULL,
    nome character varying(60) NOT NULL
);


--
-- Name: segmento_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.segmento ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.segmento_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: startup; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.startup (
    id bigint NOT NULL,
    usuario_id uuid NOT NULL,
    segmento_id smallint,
    nome character varying(100) NOT NULL,
    cnpj character(14) NOT NULL,
    fase character varying(30) NOT NULL,
    descricao character varying(500),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    video_pitch_url text,
    data_fundacao date,
    site_url text,
    localizacao text,
    latitude double precision,
    longitude double precision,
    cidade text,
    estado text,
    linkedin_url text,
    CONSTRAINT startup_cnpj_check CHECK ((cnpj ~ '^[0-9]{14}$'::text)),
    CONSTRAINT startup_data_fundacao_nao_futura CHECK (((data_fundacao IS NULL) OR (data_fundacao <= CURRENT_DATE)))
);


--
-- Name: COLUMN startup.video_pitch_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.startup.video_pitch_url IS 'Optional YouTube URL for the startup pitch video.';


--
-- Name: COLUMN startup.data_fundacao; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.startup.data_fundacao IS 'Optional startup founding date. The UI collects month and year.';


--
-- Name: COLUMN startup.site_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.startup.site_url IS 'Optional public website URL for the startup.';


--
-- Name: COLUMN startup.localizacao; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.startup.localizacao IS 'Optional public location label such as city and state.';


--
-- Name: COLUMN startup.latitude; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.startup.latitude IS 'Optional latitude provided with the startup location permission.';


--
-- Name: COLUMN startup.longitude; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.startup.longitude IS 'Optional longitude provided with the startup location permission.';


--
-- Name: COLUMN startup.cidade; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.startup.cidade IS 'Optional city where the startup is based.';


--
-- Name: COLUMN startup.estado; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.startup.estado IS 'Optional Brazilian state where the startup is based.';


--
-- Name: startup_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.startup ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.startup_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: startup_segmento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.startup_segmento (
    startup_id bigint NOT NULL,
    segmento_id bigint NOT NULL
);


--
-- Name: TABLE startup_segmento; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.startup_segmento IS 'Secondary segments associated with a startup. The primary segment remains startup.segmento_id.';


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario (
    id uuid NOT NULL,
    nome character varying(100) NOT NULL,
    tipo public.tipo_usuario NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Data for Name: captacao; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.captacao (id, startup_id, valor_alvo, valor_captado, percentual_equity_oferecido, status, data_inicio, data_fim, created_at) FROM stdin;
\.


--
-- Data for Name: investidor; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.investidor (id, usuario_id, nome, cpf, tipo, biografia, ticket_min, ticket_max, created_at, linkedin_url) FROM stdin;
\.


--
-- Data for Name: investidor_segmento; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.investidor_segmento (investidor_id, segmento_id) FROM stdin;
\.


--
-- Data for Name: match; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.match (id, captacao_id, investidor_id, status, valor_proposto, created_at) FROM stdin;
\.


--
-- Data for Name: segmento; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.segmento (id, nome) FROM stdin;
\.


--
-- Data for Name: startup; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.startup (id, usuario_id, segmento_id, nome, cnpj, fase, descricao, created_at, video_pitch_url, data_fundacao, site_url, localizacao, latitude, longitude, cidade, estado, linkedin_url) FROM stdin;
\.


--
-- Data for Name: startup_segmento; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.startup_segmento (startup_id, segmento_id) FROM stdin;
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuario (id, nome, tipo, ativo, created_at) FROM stdin;
\.


--
-- Name: captacao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--



--
-- Name: investidor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--



--
-- Name: match_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--



--
-- Name: segmento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--



--
-- Name: startup_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--



--
-- Name: captacao captacao_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.captacao
    ADD CONSTRAINT captacao_pkey PRIMARY KEY (id);


--
-- Name: investidor investidor_cpf_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investidor
    ADD CONSTRAINT investidor_cpf_key UNIQUE (cpf);


--
-- Name: investidor investidor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investidor
    ADD CONSTRAINT investidor_pkey PRIMARY KEY (id);


--
-- Name: investidor_segmento investidor_segmento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investidor_segmento
    ADD CONSTRAINT investidor_segmento_pkey PRIMARY KEY (investidor_id, segmento_id);


--
-- Name: investidor investidor_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investidor
    ADD CONSTRAINT investidor_usuario_id_key UNIQUE (usuario_id);


--
-- Name: match match_captacao_id_investidor_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.match
    ADD CONSTRAINT match_captacao_id_investidor_id_key UNIQUE (captacao_id, investidor_id);


--
-- Name: match match_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.match
    ADD CONSTRAINT match_pkey PRIMARY KEY (id);


--
-- Name: segmento segmento_nome_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.segmento
    ADD CONSTRAINT segmento_nome_key UNIQUE (nome);


--
-- Name: segmento segmento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.segmento
    ADD CONSTRAINT segmento_pkey PRIMARY KEY (id);


--
-- Name: startup startup_cnpj_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.startup
    ADD CONSTRAINT startup_cnpj_key UNIQUE (cnpj);


--
-- Name: startup startup_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.startup
    ADD CONSTRAINT startup_pkey PRIMARY KEY (id);


--
-- Name: startup_segmento startup_segmento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.startup_segmento
    ADD CONSTRAINT startup_segmento_pkey PRIMARY KEY (startup_id, segmento_id);


--
-- Name: startup startup_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.startup
    ADD CONSTRAINT startup_usuario_id_key UNIQUE (usuario_id);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- Name: captacao_startup_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX captacao_startup_idx ON public.captacao USING btree (startup_id);


--
-- Name: investidor_segmento_segmento_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX investidor_segmento_segmento_idx ON public.investidor_segmento USING btree (segmento_id);


--
-- Name: match_investidor_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX match_investidor_idx ON public.match USING btree (investidor_id);


--
-- Name: startup_segmento_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX startup_segmento_idx ON public.startup USING btree (segmento_id);


--
-- Name: captacao captacao_startup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.captacao
    ADD CONSTRAINT captacao_startup_id_fkey FOREIGN KEY (startup_id) REFERENCES public.startup(id) ON DELETE CASCADE;


--
-- Name: investidor_segmento investidor_segmento_investidor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investidor_segmento
    ADD CONSTRAINT investidor_segmento_investidor_id_fkey FOREIGN KEY (investidor_id) REFERENCES public.investidor(id) ON DELETE CASCADE;


--
-- Name: investidor_segmento investidor_segmento_segmento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investidor_segmento
    ADD CONSTRAINT investidor_segmento_segmento_id_fkey FOREIGN KEY (segmento_id) REFERENCES public.segmento(id) ON DELETE CASCADE;


--
-- Name: investidor investidor_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.investidor
    ADD CONSTRAINT investidor_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: match match_captacao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.match
    ADD CONSTRAINT match_captacao_id_fkey FOREIGN KEY (captacao_id) REFERENCES public.captacao(id) ON DELETE CASCADE;


--
-- Name: match match_investidor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.match
    ADD CONSTRAINT match_investidor_id_fkey FOREIGN KEY (investidor_id) REFERENCES public.investidor(id) ON DELETE CASCADE;


--
-- Name: startup startup_segmento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.startup
    ADD CONSTRAINT startup_segmento_id_fkey FOREIGN KEY (segmento_id) REFERENCES public.segmento(id);


--
-- Name: startup_segmento startup_segmento_segmento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.startup_segmento
    ADD CONSTRAINT startup_segmento_segmento_id_fkey FOREIGN KEY (segmento_id) REFERENCES public.segmento(id) ON DELETE CASCADE;


--
-- Name: startup_segmento startup_segmento_startup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.startup_segmento
    ADD CONSTRAINT startup_segmento_startup_id_fkey FOREIGN KEY (startup_id) REFERENCES public.startup(id) ON DELETE CASCADE;


--
-- Name: startup startup_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.startup
    ADD CONSTRAINT startup_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: usuario usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: captacao; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.captacao ENABLE ROW LEVEL SECURITY;

--
-- Name: captacao captacao_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY captacao_delete_own ON public.captacao FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.startup s
  WHERE ((s.id = captacao.startup_id) AND (s.usuario_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: captacao captacao_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY captacao_insert_own ON public.captacao FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.startup s
  WHERE ((s.id = captacao.startup_id) AND (s.usuario_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: captacao captacao_select_auth; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY captacao_select_auth ON public.captacao FOR SELECT TO authenticated USING (true);


--
-- Name: captacao captacao_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY captacao_update_own ON public.captacao FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.startup s
  WHERE ((s.id = captacao.startup_id) AND (s.usuario_id = ( SELECT auth.uid() AS uid)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.startup s
  WHERE ((s.id = captacao.startup_id) AND (s.usuario_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: investidor_segmento inv_seg_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY inv_seg_delete_own ON public.investidor_segmento FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.investidor i
  WHERE ((i.id = investidor_segmento.investidor_id) AND (i.usuario_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: investidor_segmento inv_seg_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY inv_seg_insert_own ON public.investidor_segmento FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.investidor i
  WHERE ((i.id = investidor_segmento.investidor_id) AND (i.usuario_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: investidor_segmento inv_seg_select_auth; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY inv_seg_select_auth ON public.investidor_segmento FOR SELECT TO authenticated USING (true);


--
-- Name: investidor; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.investidor ENABLE ROW LEVEL SECURITY;

--
-- Name: investidor investidor_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY investidor_delete_own ON public.investidor FOR DELETE TO authenticated USING ((usuario_id = ( SELECT auth.uid() AS uid)));


--
-- Name: investidor investidor_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY investidor_insert_own ON public.investidor FOR INSERT TO authenticated WITH CHECK ((usuario_id = ( SELECT auth.uid() AS uid)));


--
-- Name: investidor_segmento; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.investidor_segmento ENABLE ROW LEVEL SECURITY;

--
-- Name: investidor investidor_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY investidor_select_own ON public.investidor FOR SELECT TO authenticated USING ((usuario_id = ( SELECT auth.uid() AS uid)));


--
-- Name: investidor investidor_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY investidor_update_own ON public.investidor FOR UPDATE TO authenticated USING ((usuario_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((usuario_id = ( SELECT auth.uid() AS uid)));


--
-- Name: match; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.match ENABLE ROW LEVEL SECURITY;

--
-- Name: match match_insert_investidor; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY match_insert_investidor ON public.match FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.investidor i
  WHERE ((i.id = match.investidor_id) AND (i.usuario_id = ( SELECT auth.uid() AS uid))))));


--
-- Name: match match_select_partes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY match_select_partes ON public.match FOR SELECT TO authenticated USING (((EXISTS ( SELECT 1
   FROM public.investidor i
  WHERE ((i.id = match.investidor_id) AND (i.usuario_id = ( SELECT auth.uid() AS uid))))) OR (EXISTS ( SELECT 1
   FROM (public.captacao c
     JOIN public.startup s ON ((s.id = c.startup_id)))
  WHERE ((c.id = match.captacao_id) AND (s.usuario_id = ( SELECT auth.uid() AS uid)))))));


--
-- Name: match match_update_partes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY match_update_partes ON public.match FOR UPDATE TO authenticated USING (((EXISTS ( SELECT 1
   FROM public.investidor i
  WHERE ((i.id = match.investidor_id) AND (i.usuario_id = ( SELECT auth.uid() AS uid))))) OR (EXISTS ( SELECT 1
   FROM (public.captacao c
     JOIN public.startup s ON ((s.id = c.startup_id)))
  WHERE ((c.id = match.captacao_id) AND (s.usuario_id = ( SELECT auth.uid() AS uid))))))) WITH CHECK (((EXISTS ( SELECT 1
   FROM public.investidor i
  WHERE ((i.id = match.investidor_id) AND (i.usuario_id = ( SELECT auth.uid() AS uid))))) OR (EXISTS ( SELECT 1
   FROM (public.captacao c
     JOIN public.startup s ON ((s.id = c.startup_id)))
  WHERE ((c.id = match.captacao_id) AND (s.usuario_id = ( SELECT auth.uid() AS uid)))))));


--
-- Name: segmento; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.segmento ENABLE ROW LEVEL SECURITY;

--
-- Name: segmento segmento_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY segmento_select_all ON public.segmento FOR SELECT TO authenticated, anon USING (true);


--
-- Name: startup; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.startup ENABLE ROW LEVEL SECURITY;

--
-- Name: startup startup_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY startup_delete_own ON public.startup FOR DELETE TO authenticated USING ((usuario_id = ( SELECT auth.uid() AS uid)));


--
-- Name: startup startup_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY startup_insert_own ON public.startup FOR INSERT TO authenticated WITH CHECK ((usuario_id = ( SELECT auth.uid() AS uid)));


--
-- Name: startup_segmento; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.startup_segmento ENABLE ROW LEVEL SECURITY;

--
-- Name: startup_segmento startup_segmento_delete_owner; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY startup_segmento_delete_owner ON public.startup_segmento FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.startup
  WHERE ((startup.id = startup_segmento.startup_id) AND (startup.usuario_id = auth.uid())))));


--
-- Name: startup_segmento startup_segmento_insert_owner; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY startup_segmento_insert_owner ON public.startup_segmento FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.startup
  WHERE ((startup.id = startup_segmento.startup_id) AND (startup.usuario_id = auth.uid())))));


--
-- Name: startup_segmento startup_segmento_select_authenticated; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY startup_segmento_select_authenticated ON public.startup_segmento FOR SELECT TO authenticated USING (true);


--
-- Name: startup startup_select_auth; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY startup_select_auth ON public.startup FOR SELECT TO authenticated USING (true);


--
-- Name: startup startup_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY startup_update_own ON public.startup FOR UPDATE TO authenticated USING ((usuario_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((usuario_id = ( SELECT auth.uid() AS uid)));


--
-- Name: usuario; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.usuario ENABLE ROW LEVEL SECURITY;

--
-- Name: usuario usuario_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY usuario_insert_own ON public.usuario FOR INSERT TO authenticated WITH CHECK ((id = ( SELECT auth.uid() AS uid)));


--
-- Name: usuario usuario_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY usuario_select_own ON public.usuario FOR SELECT TO authenticated USING ((id = ( SELECT auth.uid() AS uid)));


--
-- Name: usuario usuario_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY usuario_update_own ON public.usuario FOR UPDATE TO authenticated USING ((id = ( SELECT auth.uid() AS uid))) WITH CHECK ((id = ( SELECT auth.uid() AS uid)));


--
-- PostgreSQL database dump complete
--


