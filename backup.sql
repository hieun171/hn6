--
-- PostgreSQL database dump
--

\restrict mF8cRewBdpvjSp2LSrCnHtgh8xa6GqYqePhharyPDTxAUvYRr3FkMUeBf47TYCQ

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cliinfo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliinfo (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    phone character varying(15) NOT NULL,
    email character varying(25) NOT NULL,
    commu character varying(100) NOT NULL,
    comment text,
    eventdate date DEFAULT CURRENT_DATE,
    "time" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cliinfo OWNER TO postgres;

--
-- Name: cliinfo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cliinfo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cliinfo_id_seq OWNER TO postgres;

--
-- Name: cliinfo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cliinfo_id_seq OWNED BY public.cliinfo.id;


--
-- Name: my_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.my_user (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    pw character varying(100) NOT NULL,
    created_date date DEFAULT CURRENT_DATE,
    created_at_alt timestamp with time zone DEFAULT now()
);


ALTER TABLE public.my_user OWNER TO postgres;

--
-- Name: my_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.my_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.my_user_id_seq OWNER TO postgres;

--
-- Name: my_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.my_user_id_seq OWNED BY public.my_user.id;


--
-- Name: taxrate_2025; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.taxrate_2025 (
    id integer NOT NULL,
    year character varying(4) DEFAULT '2025'::character varying,
    fs character varying(20),
    lr money,
    hr money,
    tr numeric
);


ALTER TABLE public.taxrate_2025 OWNER TO postgres;

--
-- Name: taxrate_2025_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.taxrate_2025_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.taxrate_2025_id_seq OWNER TO postgres;

--
-- Name: taxrate_2025_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.taxrate_2025_id_seq OWNED BY public.taxrate_2025.id;


--
-- Name: visitors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.visitors (
    id integer NOT NULL,
    ip_address character varying(255) NOT NULL,
    visited_at timestamp without time zone NOT NULL
);


ALTER TABLE public.visitors OWNER TO postgres;

--
-- Name: visitors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.visitors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.visitors_id_seq OWNER TO postgres;

--
-- Name: visitors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.visitors_id_seq OWNED BY public.visitors.id;


--
-- Name: visits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.visits (
    id integer NOT NULL,
    total_count integer DEFAULT 0,
    last_updated time without time zone DEFAULT now()
);


ALTER TABLE public.visits OWNER TO postgres;

--
-- Name: visits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.visits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.visits_id_seq OWNER TO postgres;

--
-- Name: visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.visits_id_seq OWNED BY public.visits.id;


--
-- Name: cliinfo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliinfo ALTER COLUMN id SET DEFAULT nextval('public.cliinfo_id_seq'::regclass);


--
-- Name: my_user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.my_user ALTER COLUMN id SET DEFAULT nextval('public.my_user_id_seq'::regclass);


--
-- Name: taxrate_2025 id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taxrate_2025 ALTER COLUMN id SET DEFAULT nextval('public.taxrate_2025_id_seq'::regclass);


--
-- Name: visitors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitors ALTER COLUMN id SET DEFAULT nextval('public.visitors_id_seq'::regclass);


--
-- Name: visits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visits ALTER COLUMN id SET DEFAULT nextval('public.visits_id_seq'::regclass);


--
-- Data for Name: cliinfo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cliinfo (id, name, phone, email, commu, comment, eventdate, "time") FROM stdin;
1	Abc	123456	abc@mail.com	Any	Hi, Thank you	2025-10-19	2025-10-19 23:43:50.385719-05
2	xyz	987456	xyz@mail.com	Any	Hi, \r\n\r\nThank you,\r\nWith love	2025-10-19	2025-10-19 23:44:30.479187-05
3	Ngoc	123	ngoc@mail.com	Any	Hi,\r\n\r\nThank,\r\n\r\nRegards	2025-10-20	2025-10-20 10:52:41.7649-05
4	Thu	123456789	thu@mail.com	Any	HI,\r\n\r\nThank you for visiting my page.\r\n\r\nRegards	2025-10-20	2025-10-20 11:31:00.162886-05
5	trang	123456789	trang@mail.com	Any	Hi,\r\n\r\nThank you very much.\r\nSee you then.	2025-10-20	2025-10-20 13:48:42.740656-05
6	hieu	123456789	hieu@mail.com	Any	Hi,\r\n\r\nThank you for coming to me.\r\n\r\nRegards,\r\n	2025-10-20	2025-10-20 14:43:30.294557-05
7	abc	123456	abc	abc	abc	2025-10-20	2025-10-20 21:35:42.661825-05
8	abc	123456	abc	abc	abc	2025-10-20	2025-10-20 21:36:25.554792-05
\.


--
-- Data for Name: my_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.my_user (id, email, pw, created_date, created_at_alt) FROM stdin;
1	abc@mail.com	$2b$12$CuEjqUmVImguEyJwqM8EXOurNasoG6.xf8G.dizBz1QAWEOUQ4oRe	2025-10-19	2025-10-19 23:37:56.577902-05
2	xyz@mail.com	$2b$12$ykzD1l1nQchWkXAT7F42bOcU.n9S6JtYCWtUKmIchvQr0JK2bc5W2	2025-10-19	2025-10-19 23:39:41.852159-05
3	123@mail.com	$2b$12$HSaKCMGUfZXe61bHvKXKLenAZbN.iFEa9SPnWwhKHHl98c8L0sr/G	2025-10-19	2025-10-19 23:41:30.588073-05
4	nhu@mail.com	$2b$12$fdP4inHo1NLgrMdhU97t8uplhFTZ1vPfANaDGIB5uI6jYZnfBaIo.	2025-10-20	2025-10-20 00:07:57.018376-05
5	trang@mail.com	$2b$12$vMCIUSbKoErGUapKNcRUFOtq5OD.uWDJwzbGpJ3ckffI0yWovYWcy	2025-10-20	2025-10-20 00:08:37.211867-05
6	ngoc@mail.com	$2b$12$B3Z4UlGgB9A/RZElQtqHd.gla2bi.91J5CJ61ECgfcmjMUSxVXgsW	2025-10-20	2025-10-20 10:43:25.740396-05
7	qwe@mail.com	$2b$12$znO55.LuHhku2CwbEl8yA.5slJ83ZuEM78OmkTBKEmPyBnnQ3jb/O	2025-10-20	2025-10-20 11:41:24.392937-05
9	hieu@mail.com	$2b$12$ClGyhpEom6uvPaBiNfBure1fA8ATg7hJEViDZAaVUlNGiY.Hfjyv.	2025-10-20	2025-10-20 18:38:02.194501-05
8	wer@mail.com	$2b$12$OOz.1ETjkBGb/zOE.hk3gepdd4dxNLAIWrPmCS16K94T7Sq7qnHBK	2025-10-20	2025-10-20 13:46:04.72831-05
10	abc@MAIL.COM	$2b$12$u8Wpc2tC9qnKu7wbjiRTYePLy2Y/nXgxfoaR3hvtcsUwhQM.3OpRm	2025-10-20	2025-10-20 18:54:00.907824-05
11	456@mail.com	$2b$12$FEtBYnOnB17Ce5Z34H4RO.GD.Z.2v4MWRjk54MQQpMZvd3QxgqCza	2025-10-20	2025-10-20 19:00:51.020571-05
\.


--
-- Data for Name: taxrate_2025; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.taxrate_2025 (id, year, fs, lr, hr, tr) FROM stdin;
1	2025	S	$0.00	$11,925.00	10
2	2025	M	$0.00	$23,850.00	10
3	2025	HH	$0.00	$17,000.00	10
4	2025	MFS	$0.00	$11,925.00	10
5	2025	S	$11,926.00	$48,475.00	12
\.


--
-- Data for Name: visitors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.visitors (id, ip_address, visited_at) FROM stdin;
1	::1	2025-10-20 17:12:07.482841
2	::1	2025-10-20 17:42:15.010969
3	::1	2025-10-20 17:42:17.937942
4	::1	2025-10-20 17:43:17.69414
5	::1	2025-10-20 17:45:13.960824
6	::1	2025-10-20 17:49:08.213913
7	::1	2025-10-20 17:49:13.008213
8	::1	2025-10-20 17:56:51.287136
9	::1	2025-10-20 17:57:39.239045
10	::1	2025-10-20 22:00:42.703442
\.


--
-- Data for Name: visits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.visits (id, total_count, last_updated) FROM stdin;
1	10	22:00:42.740383
\.


--
-- Name: cliinfo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cliinfo_id_seq', 8, true);


--
-- Name: my_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.my_user_id_seq', 11, true);


--
-- Name: taxrate_2025_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.taxrate_2025_id_seq', 5, true);


--
-- Name: visitors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.visitors_id_seq', 10, true);


--
-- Name: visits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.visits_id_seq', 1, true);


--
-- Name: cliinfo cliinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliinfo
    ADD CONSTRAINT cliinfo_pkey PRIMARY KEY (id);


--
-- Name: my_user my_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.my_user
    ADD CONSTRAINT my_user_pkey PRIMARY KEY (id);


--
-- Name: taxrate_2025 taxrate_2025_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taxrate_2025
    ADD CONSTRAINT taxrate_2025_pkey PRIMARY KEY (id);


--
-- Name: visitors visitors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT visitors_pkey PRIMARY KEY (id);


--
-- Name: visits visits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict mF8cRewBdpvjSp2LSrCnHtgh8xa6GqYqePhharyPDTxAUvYRr3FkMUeBf47TYCQ

