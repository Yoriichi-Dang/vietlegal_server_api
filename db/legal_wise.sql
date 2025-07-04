--
-- PostgreSQL database dump
--

-- Dumped from database version 17.3 (Homebrew)
-- Dumped by pg_dump version 17.3 (Homebrew)

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
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: roles_name_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.roles_name_enum AS ENUM (
    'admin',
    'user'
);


ALTER TYPE public.roles_name_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ai_models; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_models (
    model_id integer NOT NULL,
    name character varying(100) NOT NULL,
    provider character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.ai_models OWNER TO postgres;

--
-- Name: ai_models_model_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ai_models_model_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ai_models_model_id_seq OWNER TO postgres;

--
-- Name: ai_models_model_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ai_models_model_id_seq OWNED BY public.ai_models.model_id;


--
-- Name: attachments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attachments (
    attachment_id integer NOT NULL,
    message_id uuid NOT NULL,
    file_path character varying(1000) NOT NULL,
    file_name character varying(255) NOT NULL,
    file_type character varying(100) NOT NULL,
    file_size integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.attachments OWNER TO postgres;

--
-- Name: attachments_attachment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attachments_attachment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attachments_attachment_id_seq OWNER TO postgres;

--
-- Name: attachments_attachment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attachments_attachment_id_seq OWNED BY public.attachments.attachment_id;


--
-- Name: conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    is_archived boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id uuid,
    title character varying
);


ALTER TABLE public.conversations OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    model_id integer,
    conversation_id uuid NOT NULL,
    sender_type character varying(20) NOT NULL,
    content text,
    message_type character varying(20) DEFAULT 'text'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name public.roles_name_enum DEFAULT 'user'::public.roles_name_enum NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: users_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_data (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying,
    "avatarUrl" character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users_data OWNER TO postgres;

--
-- Name: users_login; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_login (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying,
    "emailVerified" boolean DEFAULT false NOT NULL,
    "verificationToken" character varying,
    "tokenExpired" timestamp without time zone,
    "resetPasswordToken" character varying,
    "resetPasswordTokenExpired" timestamp without time zone,
    "userDataId" uuid,
    provider character varying,
    "providerAccountId" character varying,
    "accessToken" character varying,
    "idToken" character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    role_id integer
);


ALTER TABLE public.users_login OWNER TO postgres;

--
-- Name: ai_models model_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_models ALTER COLUMN model_id SET DEFAULT nextval('public.ai_models_model_id_seq'::regclass);


--
-- Name: attachments attachment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments ALTER COLUMN attachment_id SET DEFAULT nextval('public.attachments_attachment_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Data for Name: ai_models; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_models (model_id, name, provider, description, created_at, updated_at) FROM stdin;
4	Qwen2.5VL 7B	alibaba	LLm Vision Model	2025-05-30 11:14:11.807979	2025-05-30 11:14:11.807979
\.


--
-- Data for Name: attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attachments (attachment_id, message_id, file_path, file_name, file_type, file_size, created_at) FROM stdin;
21	722d87e1-96b7-4962-9ede-4933dbf07215	https://legal-wise-vn.s3.ap-southeast-1.amazonaws.com/6ecae5b033b488562053bca94fb7705808f27c75d97fed3ca4c1de2450d578b6.png	Screenshot 2025-06-12 at 23.33.18.png	image/png	3898134	2025-06-13 20:53:37.504805
\.


--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conversations (id, is_archived, created_at, updated_at, user_id, title) FROM stdin;
696ecb1f-27e3-4e56-8e0d-68fd6b768a9a	t	2025-05-10 21:46:06.433839	2025-05-10 21:52:53.937	54b11266-e2bc-4ecd-bed9-68524964f128	New Conversation 3
54a4d63b-7faf-4113-b98c-f7e7e95314af	t	2025-06-02 16:54:42.037434	2025-06-06 22:40:23.655	ede7126a-9c21-48ed-9d95-fa6320754a3d	hi
8406f453-e15f-48e1-a977-2c9b26562540	t	2025-06-13 19:31:35.204188	2025-06-13 20:59:12.987	265733b6-c7b1-4bef-80f3-6f98b4b9c175	Cuộc trò chuyện mới
d5ed2918-cc70-43ff-a886-a9d9c9afda7e	t	2025-06-06 22:40:29.496441	2025-06-06 22:42:02.365	ede7126a-9c21-48ed-9d95-fa6320754a3d	Cuộc trò chuyện mới
45ca27d0-011d-4bcf-b7fc-dc3ea07951b1	t	2025-06-13 00:41:23.303076	2025-06-13 00:41:23.303076	ede7126a-9c21-48ed-9d95-fa6320754a3d	hi
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, model_id, conversation_id, sender_type, content, message_type, created_at, updated_at) FROM stdin;
68676410-bcd6-4f53-b49b-077dfab5c4b1	\N	696ecb1f-27e3-4e56-8e0d-68fd6b768a9a	user	Hello, this is a message	text	2025-05-10 21:52:53.906484	2025-05-10 21:52:53.906484
b1f78807-62b4-45a4-9187-2ce1d82abe94	\N	54a4d63b-7faf-4113-b98c-f7e7e95314af	user	hi	text	2025-06-02 16:54:42.137559	2025-06-02 16:54:42.137559
64b50fcf-2d4a-4081-b760-17338048f49b	4	54a4d63b-7faf-4113-b98c-f7e7e95314af	model	Hello! How can I assist you today?	text	2025-06-02 16:54:44.657797	2025-06-02 16:54:44.657797
c4f67a90-745f-4475-b7b6-47a5a22c3da6	\N	54a4d63b-7faf-4113-b98c-f7e7e95314af	user	hello	text	2025-06-06 22:40:23.600423	2025-06-06 22:40:23.600423
781de187-fb6d-40df-b5be-2e580b19b3f2	\N	d5ed2918-cc70-43ff-a886-a9d9c9afda7e	user	hello	text	2025-06-06 22:40:54.166012	2025-06-06 22:40:54.166012
dccdda37-d74f-4f14-978c-286a1a2acace	\N	d5ed2918-cc70-43ff-a886-a9d9c9afda7e	user	hi	text	2025-06-06 22:41:31.37144	2025-06-06 22:41:31.37144
048e8f53-3c01-45f6-8543-dbb66a38de4a	4	d5ed2918-cc70-43ff-a886-a9d9c9afda7e	model	Hello! How can I assist you today?	text	2025-06-06 22:41:33.811891	2025-06-06 22:41:33.811891
67d08b22-3a6a-4753-ac00-f146f33a3a54	\N	d5ed2918-cc70-43ff-a886-a9d9c9afda7e	user	giới thiệu về luạt pháp việt nam	text	2025-06-06 22:41:47.941687	2025-06-06 22:41:47.941687
3d035aae-6fd2-4605-a025-31271508de30	4	d5ed2918-cc70-43ff-a886-a9d9c9afda7e	model	Luật pháp Việt Nam là hệ thống các quy tắc và quy định do Nhà nước ban hành nhằm điều chỉnh các quan hệ xã hội, duy trì trật tự, bảo vệ quyền và lợi ích hợp pháp của công dân, tổ chức, và đảm bảo an ninh quốc gia. Dưới đây là một số điểm cơ bản về hệ thống pháp luật Việt Nam:\n\n1. **Hiến pháp**: Đây là văn bản pháp lý cao nhất, quy định những nguyên tắc cơ bản về tổ chức và hoạt động của Nhà nước, quyền và nghĩa vụ cơ bản của công dân. Hiến pháp hiện hành của Việt Nam được thông qua vào năm 2013.\n\n2. **Luật và Bộ luật**: Quốc hội ban hành các luật và bộ luật để điều chỉnh các lĩnh vực cụ thể như dân sự, hình sự, thương mại, lao động, và hành chính. Ví dụ, Bộ luật Dân sự, Bộ luật Hình sự, Luật Doanh nghiệp, Luật Lao động, v.v.\n\n3. **Nghị định và Thông tư**: Chính phủ và các bộ, ngành ban hành nghị định và thông tư để hướng dẫn thi hành luật và bộ luật. Nghị định thường do Chính phủ ban hành, trong khi thông tư thường do các bộ, ngành ban hành.\n\n4. **Quyết định và Chỉ thị**: Các cơ quan nhà nước có thể ban hành quyết định và chỉ thị để thực hiện các nhiệm vụ cụ thể hoặc điều chỉnh các vấn đề trong phạm vi quản lý của mình.\n\n5. **Hệ thống tòa án**: Tòa án Nhân dân là cơ quan xét xử của Việt Nam, bao gồm Tòa án Nhân dân Tối cao, các tòa án cấp tỉnh và cấp huyện. Tòa án có nhiệm vụ bảo vệ công lý, quyền con người, và giải quyết các tranh chấp pháp lý.\n\n6. **Nguyên tắc pháp quyền**: Việt Nam cam kết xây dựng Nhà nước pháp quyền xã hội chủ nghĩa, trong đó pháp luật được tôn trọng và thực thi nghiêm minh.\n\nHệ thống pháp luật Việt Nam không ngừng được hoàn thiện để đáp ứng yêu cầu phát triển kinh tế - xã hội và hội nhập quốc tế. Nếu bạn cần thông tin chi tiết về một lĩnh vực pháp luật cụ thể, hãy cho tôi biết!	text	2025-06-06 22:42:02.357947	2025-06-06 22:42:02.357947
b47ee4b3-9510-438e-a4dd-6e77d35465c7	\N	8406f453-e15f-48e1-a977-2c9b26562540	user	hi	text	2025-06-13 19:32:18.878512	2025-06-13 19:32:18.878512
6db74267-bb0c-4734-97e1-0f7b38880a89	4	8406f453-e15f-48e1-a977-2c9b26562540	model	Xin chào! Tôi có thể giúp gì cho bạn?	text	2025-06-13 19:32:22.613755	2025-06-13 19:32:22.613755
2da67546-f0a6-4ba1-ab26-29791ea33d53	\N	8406f453-e15f-48e1-a977-2c9b26562540	user	giới thiệu về đại học bách khoa đà nẵng	text	2025-06-13 19:32:34.369483	2025-06-13 19:32:34.369483
bff302d7-111f-43f9-bd88-ae0fc2e4eb1b	4	8406f453-e15f-48e1-a977-2c9b26562540	model	# Báo cáo tổng hợp về Trường Đại học Bách khoa - Đại học Đà Nẵng\n\n## Giới thiệu chung\n\nTrường Đại học Bách khoa Đà Nẵng (BKĐN) là một trong những trường đại học kỹ thuật hàng đầu tại miền Trung Việt Nam, trực thuộc Đại học Đà Nẵng, được thành lập năm 1975. Trường có trụ sở chính tại thành phố Đà Nẵng và là trung tâm đào tạo, nghiên cứu khoa học kỹ thuật và chuyển giao công nghệ quan trọng của khu vực miền Trung.\n\nBKĐN nằm trong nhóm các đại học trọng điểm quốc gia, góp phần đào tạo nguồn nhân lực chất lượng cao cho ngành kỹ thuật và công nghệ. Năm 2017, trường đã đạt chuẩn quốc tế trong đào tạo và nghiên cứu, được Hội đồng cấp cao đánh giá nghiên cứu và giáo dục đại học châu Âu (HCERES) công nhận, là một trong bốn trường đại học đầu tiên của Việt Nam đạt được chứng nhận này, khẳng định vị thế và chất lượng giáo dục trên trường quốc tế.\n\n## Cơ sở vật chất và đội ngũ giảng viên\n\n- **Khuôn viên:** Trường có khuôn viên rộng hơn 24ha (540.900m2), bao gồm nhiều phòng học, phòng thí nghiệm hiện đại và thư viện điện tử lớn nhất miền Trung.\n- **Đội ngũ giảng viên:** Gồm 63 giáo sư, phó giáo sư, 295 tiến sĩ, 365 thạc sĩ và 205 giảng viên, đảm bảo chất lượng đào tạo và nghiên cứu.\n\n## Chương trình đào tạo và cơ hội việc làm\n\nTrường cung cấp nhiều chương trình đào tạo đa dạng, phù hợp với nhu cầu phát triển của xã hội và thị trường lao động. Có nhiều phương thức tuyển sinh linh hoạt, tạo điều kiện thuận lợi cho sinh viên. Bên cạnh đó, trường liên kết chặt chẽ với các doanh nghiệp trong và ngoài nước, giúp sinh viên có nhiều cơ hội thực tập và việc làm sau khi tốt nghiệp.\n\n## Hoạt động hợp tác và nghiên cứu\n\nTrường thường xuyên tổ chức các hội thảo quốc tế, ký kết các thỏa thuận hợp tác với nhiều doanh nghiệp và tổ chức trong và ngoài nước. Những hoạt động này nhằm nâng cao chất lượng đào tạo, thúc đẩy nghiên cứu khoa học và phát triển công nghệ, góp phần đáp ứng nhu cầu phát triển kinh tế - xã hội của khu vực và cả nước.\n\n## Kết luận\n\nTrường Đại học Bách khoa - Đại học Đà Nẵng là một địa chỉ đào tạo uy tín, chất lượng cao trong lĩnh vực kỹ thuật và công nghệ tại miền Trung Việt Nam. Với đội ngũ giảng viên trình độ cao, cơ sở vật chất hiện đại, chương trình đào tạo đa dạng và các hoạt động hợp tác nghiên cứu tích cực, trường không chỉ đáp ứng nhu cầu học tập của sinh viên mà còn góp phần quan trọng vào sự phát triển khoa học công nghệ và kinh tế xã hội của khu vực.\n\n---\n\n### Tham khảo:\n- [Wikipedia - Trường Đại học Bách khoa, Đại học Đà Nẵng](https://vi.wikipedia.org/wiki/Trường_Đại_học_Bách_khoa,_Đại_học_Đà_Nẵng)\n- [ihoc.vn - Trường Đại học Bách Khoa Đà Nẵng](https://ihoc.vn/da-nang/quan-lien-chieu/truong-dai-hoc-bach-khoa-da-nang-1873.html)\n- [Trang chính thức Trường Đại học Bách khoa - Đại học Đà Nẵng](http://dut.udn.vn/)	text	2025-06-13 19:35:07.773949	2025-06-13 19:35:07.773949
722d87e1-96b7-4962-9ede-4933dbf07215	\N	8406f453-e15f-48e1-a977-2c9b26562540	user	phân tích file sau giúp tôi	text	2025-06-13 20:53:37.495987	2025-06-13 20:53:37.495987
1d56b433-200f-4c3c-802e-6d64164e8204	4	8406f453-e15f-48e1-a977-2c9b26562540	model	# Báo Cáo Tổng Hợp Tham Gia Bảo Hiểm và Tỷ Lệ Chậm Đóng Theo Tỉnh Thành tại Việt Nam\n\n## 1. Giới thiệu\nBáo cáo tổng hợp này dựa trên bảng thống kê chi tiết về việc tham gia các loại bảo hiểm và tỷ lệ chậm đóng bảo hiểm theo từng quý tại các tỉnh, thành phố của Việt Nam. Các loại bảo hiểm được phân tích bao gồm:\n\n- Bảo hiểm xã hội bắt buộc (BHXH bắt buộc)\n- Bảo hiểm y tế tự nguyện (BHYT tự nguyện)\n- Bảo hiểm thất nghiệp (BH thất nghiệp)\n- Bảo hiểm y tế\n\nNgoài ra, báo cáo còn tập trung vào tỷ lệ chậm đóng bảo hiểm được phân theo từng quý (Quý I, II, III, IV) cho từng địa phương.\n\n## 2. Phạm vi và dữ liệu\n- **Phạm vi địa lý:** Bao gồm nhiều tỉnh, thành phố như Quảng Trị, TP Huế, Bình Định, Quảng Ngãi, Khánh Hòa, cùng nhiều địa phương khác trên toàn quốc.\n- **Dữ liệu tham gia bảo hiểm:** Mỗi tỉnh, thành phố có số liệu cụ thể về số người tham gia từng loại bảo hiểm.\n- **Tỷ lệ chậm đóng:** Được biểu thị bằng phần trăm, cho thấy mức độ chậm đóng bảo hiểm của các địa phương qua từng quý.\n\n## 3. Phân tích dữ liệu\n- **Tổng hợp toàn quốc:** Dòng đầu tiên của bảng thể hiện tổng số liệu trên toàn quốc, giúp so sánh và đánh giá chung về mức độ tham gia và chậm đóng bảo hiểm.\n- **Xu hướng chung:** Phần lớn các tỉnh, thành phố đều có xu hướng giảm tỷ lệ chậm đóng từ Quý I đến Quý IV, cho thấy sự cải thiện trong việc tuân thủ đóng bảo hiểm.\n- **Sự khác biệt địa phương:** Một số tỉnh có tỷ lệ chậm đóng cao hơn hoặc thấp hơn mức trung bình toàn quốc, phản ánh sự khác biệt về điều kiện kinh tế, nhận thức và quản lý tại từng địa phương.\n\n## 4. Ý nghĩa và ứng dụng\n- Bảng thống kê và báo cáo này là công cụ quan trọng giúp các cơ quan quản lý nhà nước và bảo hiểm xã hội đánh giá hiệu quả công tác bảo hiểm xã hội và y tế.\n- Qua đó, các cơ quan có thể xây dựng và điều chỉnh chính sách nhằm nâng cao tỷ lệ tham gia bảo hiểm và giảm thiểu tình trạng chậm đóng, góp phần đảm bảo quyền lợi cho người lao động và người dân.\n\n## 5. Hình ảnh minh họa\n\n![Bảng Thống Kê Tham Gia Bảo Hiểm và Tỷ Lệ Chậm Đóng Theo Tỉnh Thành tại Việt Nam](https://legal-wise-vn.s3.ap-southeast-1.amazonaws.com/6ecae5b033b488562053bca94fb7705808f27c75d97fed3ca4c1de2450d578b6.png)\n\n---\n\n**Nguồn:** [Bảng Thống Kê Tham Gia Bảo Hiểm và Tỷ Lệ Chậm Đóng Theo Tỉnh Thành tại Việt Nam](https://legal-wise-vn.s3.ap-southeast-1.amazonaws.com/6ecae5b033b488562053bca94fb7705808f27c75d97fed3ca4c1de2450d578b6.png)	text	2025-06-13 20:55:55.778967	2025-06-13 20:55:55.778967
d6118b0b-c307-410f-a70d-5505f51c8b33	\N	8406f453-e15f-48e1-a977-2c9b26562540	user	cho tôi biết tin tức mới nhất ở việt nam	text	2025-06-13 20:56:32.8687	2025-06-13 20:56:32.8687
3ac6e0c8-5983-4d76-a6ff-a36674041f76	4	8406f453-e15f-48e1-a977-2c9b26562540	model	# Báo cáo tổng hợp tin tức nổi bật tại Việt Nam\n\nDưới đây là tổng hợp các tin tức quan trọng và nổi bật được cập nhật từ các nguồn báo điện tử uy tín tại Việt Nam như VietNamNet, 24h.com.vn và VnExpress.\n\n---\n\n## 1. Chính trị và hành chính\n\n- **Sắp xếp đơn vị hành chính cấp tỉnh:** Bộ Nội vụ đã trình Chính phủ đề án sắp xếp các đơn vị hành chính cấp tỉnh dự kiến thực hiện vào năm 2025. Theo đó, sẽ có hơn 4.000 trụ sở dôi dư được xử lý nhằm nâng cao hiệu quả quản lý.\n\n- **Giảm số tỉnh, thành phố:** Quốc hội đã thông qua nghị quyết giảm số tỉnh, thành phố từ 63 xuống còn 34 nhằm tinh gọn bộ máy hành chính và nâng cao hiệu quả quản lý nhà nước.\n\n- **Hoạt động đối ngoại:** Tổng Bí thư Tô Lâm đã có các cuộc gặp gỡ, tiếp xúc song phương với lãnh đạo nhiều nước tại Nga, tăng cường quan hệ hợp tác quốc tế.\n\n## 2. Thời tiết và thiên tai\n\n- **Bão số 1 (Wutip):** Cơn bão Wutip đã đổ bộ vào Việt Nam hai lần, gây mưa lớn và thời tiết xấu trên diện rộng, ảnh hưởng đến đời sống và sản xuất của người dân. Người dân được khuyến cáo theo dõi thông tin dự báo thời tiết để chủ động phòng tránh.\n\n## 3. Kinh tế và doanh nghiệp\n\n- **Giá điện sinh hoạt tăng:** Giá điện sinh hoạt bậc cao nhất đã tăng lên mức 3.460 đồng/kWh, ảnh hưởng đến chi phí sinh hoạt của người dân.\n\n- **VinFast ra mắt dịch vụ hậu mãi mới:** Dịch vụ hậu mãi tận tâm giúp chủ xe VinFast VF 8 tự tin chinh phục mọi nẻo đường, nâng cao trải nghiệm và sự an tâm cho khách hàng.\n\n- **Vinhomes Golden City chính thức ra mắt:** Đây là biểu tượng mới trên bản đồ giao thương miền Bắc, đánh dấu bước phát triển mới trong lĩnh vực bất động sản và kinh doanh.\n\n- **Home Credit hỗ trợ người tiêu dùng dịp hè:** Cung cấp các giải pháp tài chính linh hoạt giúp người tiêu dùng dễ dàng tiếp cận sản phẩm và dịch vụ trong mùa hè.\n\n- **Chủ chuỗi bán thịt G Kitchen lãi kỷ lục năm 2024:** Thành công nổi bật trong lĩnh vực thực phẩm, ghi nhận mức lợi nhuận cao.\n\n- **Giá mít Thái giảm mạnh:** Giá mít Thái hiện chỉ còn khoảng 4.000 đồng/kg, ảnh hưởng đến người trồng mít.\n\n## 4. Giao thông và sự cố\n\n- **Sự cố hàng không:** Một chiếc máy bay của Vietjet đã trượt khỏi đường băng khi hạ cánh tại sân bay Tân Sơn Nhất, hiện đang được điều tra làm rõ.\n\n## 5. Y tế và cộng đồng\n\n- **Khởi động hành trình sức khỏe vì một Việt Nam khỏe mạnh:** Long Châu phối hợp cùng Khoa Y – Đại học Y tổ chức khám lưu động miễn phí tại các vùng sâu vùng xa, góp phần nâng cao sức khỏe cộng đồng.\n\n## 6. Giáo dục và xã hội\n\n- **Đề xuất bỏ mô hình đại học quốc gia:** Gây nhiều tranh luận trong giới giáo dục và xã hội.\n\n## 7. Tin quốc tế\n\n- **Thủ tướng Ấn Độ ca ngợi tổ hợp phòng không S-400:** Tin tức quốc tế được quan tâm, thể hiện sự hợp tác quốc phòng giữa các quốc gia.\n\n---\n\n### Kết luận\n\nCác tin tức trên phản ánh bức tranh đa dạng về tình hình chính trị, kinh tế, xã hội và thiên tai tại Việt Nam trong thời gian gần đây. Việc sắp xếp hành chính và giảm số lượng tỉnh thành nhằm nâng cao hiệu quả quản lý nhà nước. Bão Wutip gây ảnh hưởng lớn đến đời sống người dân, trong khi các doanh nghiệp như VinFast, Vinhomes và Home Credit có những bước phát triển tích cực. Các sự kiện y tế cộng đồng và giáo dục cũng được quan tâm.\n\nĐể cập nhật thông tin chi tiết và liên tục, độc giả có thể truy cập các trang báo chính thức:\n\n- [VietNamNet](https://vietnamnet.vn/)\n- [24h.com.vn](https://www.24h.com.vn/tin-tuc-trong-ngay-c46.html)\n- [VnExpress](https://vnexpress.net/)\n\n---\n\n*Báo cáo được tổng hợp bởi chuyên gia viết báo cáo, dựa trên các nguồn tin chính thống và cập nhật mới nhất.*	text	2025-06-13 20:59:12.976845	2025-06-13 20:59:12.976845
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description, created_at, updated_at) FROM stdin;
1	admin	Administrator with full system access	2025-05-10 22:19:02.237427	2025-05-10 22:19:02.237427
2	user	Regular user with basic access	2025-05-10 22:19:02.247564	2025-05-10 22:19:02.247564
\.


--
-- Data for Name: users_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_data (id, name, "avatarUrl", created_at, updated_at) FROM stdin;
a1dcc76b-5653-415a-8362-55c1e19daff4	admin	\N	2025-05-03 17:23:20.071665	2025-05-03 17:23:20.071665
aa4a6be6-5556-4ddd-9009-429328f02338	helllo	\N	2025-05-03 17:24:55.995458	2025-05-03 17:24:55.995458
59a58941-ee5c-4609-9b41-1e32c4d01ecc	admin	\N	2025-05-03 17:25:53.704619	2025-05-03 17:25:53.704619
c341a21a-1115-42e8-be4f-863afde3e74d	admin	\N	2025-05-03 17:28:43.904143	2025-05-03 17:28:43.904143
7ff4015b-684b-4fcf-9701-3944c717a9f4	nguyen	\N	2025-05-03 17:30:37.822491	2025-05-03 17:30:37.822491
16530d69-0739-4a4b-93f1-9991fabb6f60	Dang nguyen	\N	2025-05-03 17:33:17.081134	2025-05-03 17:33:17.081134
d5716534-a369-44cc-9606-c5b27d4c0d38	admin	\N	2025-05-03 17:38:07.141964	2025-05-03 17:38:07.141964
0d5c6b4f-93e6-460a-b0b8-ee6de84502d8	admin	\N	2025-05-03 17:38:32.397364	2025-05-03 17:38:32.397364
54fac1e5-b84b-414a-b8fd-ea0a13f68ece	admin	\N	2025-05-03 17:38:40.431397	2025-05-03 17:38:40.431397
9e61929e-7fc9-4fc5-a474-62c2706919a3	admin	\N	2025-05-03 17:39:25.658918	2025-05-03 17:39:25.658918
c5002cd8-66b6-4267-9ce9-e56bfcd869ba	admin	\N	2025-05-03 17:40:31.998087	2025-05-03 17:40:31.998087
c0cfe19b-84e5-4a3d-9afc-0b2f44c5831d	hoangnguyen241003	\N	2025-05-10 21:42:55.772833	2025-05-10 21:42:55.772833
c75f42c7-b6d2-45f0-b0b7-c98c979964c4	System Admin	\N	2025-05-10 22:25:34.582352	2025-05-10 22:25:34.582352
3e208b06-481e-4b67-8627-9bc6cfcfba51	Nguyên Đặng	https://lh3.googleusercontent.com/a/ACg8ocJTIBfrIWIkzEH_vO_PYnvhgGFs-I-VoBywyXElKYbvmLLIhNQ3=s96-c	2025-05-11 00:01:08.748079	2025-05-11 00:01:08.748079
f456f3fe-ff56-48b7-9a24-e29176cf5844	yorichi_dang2311	https://res.cloudinary.com/dbarcpqup/image/upload/v1748704073/user_avatars/jyuxcqvjghvlwnjfhfua.jpg	2025-05-03 16:09:29.475969	2025-05-31 22:07:59.315396
\.


--
-- Data for Name: users_login; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_login (id, email, password, "emailVerified", "verificationToken", "tokenExpired", "resetPasswordToken", "resetPasswordTokenExpired", "userDataId", provider, "providerAccountId", "accessToken", "idToken", created_at, updated_at, role_id) FROM stdin;
ede7126a-9c21-48ed-9d95-fa6320754a3d	nguyendang@dn.soc.one	$2b$10$IuHE13exVIlP9RA0lovTpeEIDdoCinEYx.7Ga/i.8HkYeordc3bZi	f	\N	\N	\N	\N	f456f3fe-ff56-48b7-9a24-e29176cf5844	\N	\N	\N	\N	2025-05-03 16:09:33.31527	2025-05-31 22:11:55.370249	\N
fc148ff9-3d42-414b-b6e2-dcac0d3bcbfc	dangnguyen241003@gmail.com	$2b$10$tpAAnli.SLJefNePzGeTKuSmpuxppNBWGw404Ksxt.ru22kmf7Zcy	f	\N	\N	\N	\N	a1dcc76b-5653-415a-8362-55c1e19daff4	\N	\N	\N	\N	2025-05-03 17:23:20.071665	2025-05-03 17:23:20.071665	\N
6c9ac1c3-2168-46ac-9f7d-f189c1327c77	102210094@sv1.dut.udn.vn	$2b$10$QhDut.xHdvKVCWoWceptU.Ppa2q0Lh2uqJnzrWr2mFPSHqreuIuei	f	\N	\N	\N	\N	aa4a6be6-5556-4ddd-9009-429328f02338	\N	\N	\N	\N	2025-05-03 17:24:55.995458	2025-05-03 17:24:55.995458	\N
13c1f68e-a688-42bd-ad36-9fd57c29445c	hoangnguyen2410103@gmail.com	$2b$10$Qyo4hq1ouy5VRe9IonQJmurkqDmxKFl7je38a6BJohyto3VYaBrhC	f	\N	\N	\N	\N	59a58941-ee5c-4609-9b41-1e32c4d01ecc	\N	\N	\N	\N	2025-05-03 17:25:53.704619	2025-05-03 17:25:53.704619	\N
764724fc-827e-40de-bebd-6123570d04e7	hoangnguyen24111003@gmail.com	$2b$10$BuGUkvYwul4vnnh.WpJ4KeO7dNdR0.bDUvD49ZOpqUBVtVxN20idy	f	\N	\N	\N	\N	c341a21a-1115-42e8-be4f-863afde3e74d	\N	\N	\N	\N	2025-05-03 17:28:43.904143	2025-05-03 17:28:43.904143	\N
c85c6129-c193-4694-a6d4-e95e0bc4f3f5	hoangnguyen2421003@gmail.com	$2b$10$0HijKBwoJIWre4.Z8pcYGebkmdAyev2KhOamtEZfi1/nTeZ1PTvNW	f	\N	\N	\N	\N	7ff4015b-684b-4fcf-9701-3944c717a9f4	\N	\N	\N	\N	2025-05-03 17:30:37.822491	2025-05-03 17:30:37.822491	\N
026248b2-3cd9-4023-9583-baf4d2f69cd7	nguyendan11g@dn.soc.one	$2b$10$AwngX0iiFdU6s6ahgfTQA.KxD4Eb48Pgm3dtdZIpCqIIsY0irkEDi	f	\N	\N	\N	\N	16530d69-0739-4a4b-93f1-9991fabb6f60	\N	\N	\N	\N	2025-05-03 17:33:17.081134	2025-05-03 17:33:17.081134	\N
220956de-5fb8-4dcc-9167-ea6a3c4572ac	hoangnguyen2412003@gmail.com	$2b$10$lSiiy.MMPffJWu4mMe8Q1OJ5crRG1wy6TLos2Oub7rVIBNd/kAI0W	f	\N	\N	\N	\N	d5716534-a369-44cc-9606-c5b27d4c0d38	\N	\N	\N	\N	2025-05-03 17:38:07.141964	2025-05-03 17:38:07.141964	\N
0dca759a-a032-486e-aff3-5b5af2243651	hoangnguyen24122003@gmail.com	$2b$10$nF7XH1ac/3aHClXZPjSNZ.Yf1h/NsGS7icP8bmUGEUifCMf6TJV.K	f	\N	\N	\N	\N	0d5c6b4f-93e6-460a-b0b8-ee6de84502d8	\N	\N	\N	\N	2025-05-03 17:38:32.397364	2025-05-03 17:38:32.397364	\N
5f17a3aa-b108-405b-ba6b-e83d592725f4	hoangnguyen241232003@gmail.com	$2b$10$drKz.KasL4OjzK6dSAlrH.MW1VBn67UwP9OhTmr1IhPjgROM97MZS	f	\N	\N	\N	\N	54fac1e5-b84b-414a-b8fd-ea0a13f68ece	\N	\N	\N	\N	2025-05-03 17:38:40.431397	2025-05-03 17:38:40.431397	\N
0d5e23ea-65fa-4cc7-bf80-24cdb5c628ee	hoangnguyen2412321003@gmail.com	$2b$10$YK5L5cKGSSkdS53s4WSdjeWIqUlQxRGgjg276gbW0Oo6TgfMXBJs6	f	\N	\N	\N	\N	9e61929e-7fc9-4fc5-a474-62c2706919a3	\N	\N	\N	\N	2025-05-03 17:39:25.658918	2025-05-03 17:39:25.658918	\N
4feb25dd-10df-4641-85ab-bf64fb45ed67	hoangnguyen241013203@gmail.com	$2b$10$swA6XnWkj3OwQ92Iro81W.dtDTy10iUnBFjVOGN5XMH2cSMnhOdR.	f	\N	\N	\N	\N	c5002cd8-66b6-4267-9ce9-e56bfcd869ba	\N	\N	\N	\N	2025-05-03 17:40:31.998087	2025-05-03 17:40:31.998087	\N
265733b6-c7b1-4bef-80f3-6f98b4b9c175	hoangnguyen241003@gmail.com	\N	t	\N	\N	\N	\N	3e208b06-481e-4b67-8627-9bc6cfcfba51	google	106952628185428421511	ya29.a0AW4XtxgFDTGuynYVXS7MecqpBx_Jq6ZIK_Uxiwl6aD0Oo3grUsWqHi1ihuqQz_Dm0xed7KmLdFvIe_s2g2bV4xb0ZWZhbJVa8GUiiuRvVKzL-kVNfANsp_hp6l9G_HEANLliqcFBRolkvyGXYkMUIhS53jPnix881PHvilc1iPEaCgYKAcASARESFQHGX2MinwFjRRUkLMu20GE8t8dmEw0178	eyJhbGciOiJSUzI1NiIsImtpZCI6IjBkOGE2NzM5OWU3ODgyYWNhZTdkN2Y2OGIyMjgwMjU2YTc5NmE1ODIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI3NzcxMzYxOTQyLTI4cWFkdnY2YnQ1dGFxZWxzY2xiN3VhdWp1Y2Y5dmljLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNzc3MTM2MTk0Mi0yOHFhZHZ2NmJ0NXRhcWVsc2NsYjd1YXVqdWNmOXZpYy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwNjk1MjYyODE4NTQyODQyMTUxMSIsImVtYWlsIjoiaG9hbmduZ3V5ZW4yNDEwMDNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJIQTl1WUZGeF9RTDV2WUFWRnpFd3FRIiwibmFtZSI6Ik5ndXnDqm4gxJDhurduZyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKVElCZnJJV0lrekVIX3ZPX1BZbnZoZ0dGcy1JLVZvQnl3eVhFbEtZYnZtTExJaE5RMz1zOTYtYyIsImdpdmVuX25hbWUiOiJOZ3V5w6puIiwiZmFtaWx5X25hbWUiOiLEkOG6t25nIiwiaWF0IjoxNzQ5OTMwODkzLCJleHAiOjE3NDk5MzQ0OTN9.esbUrFU7S9_lEQLqxgis92sFt5CzHU05iqcQ3P-Qf907Zf8_Y8GPDz_E3ocY9jF-_tea4OjAvUD4lH38i8OxW-BQfBDBh8APK5C6_8h--iD-Xjquv0grH0j3kdVZbZudKrMcYsDaPpytjxuAM6s7JS-Teu70yReogD9dP527cNrOppmPUVU7SmK5DIg4yosoz10yiUj0vdq1hTAbTXhyPoshzvw86qy3F_35MgoDHjawyXBrx4Ad2eE4R9N_2XnbhtE5ONiKjpTBqtbim0KRPp7i3h-M1wHcYJDTpTyUPVAeAdn4FwMcm2JVMKIG50Kv84yUZIxHA7--ziCULRXZYQ	2025-05-11 00:01:08.748079	2025-06-15 02:54:53.831261	\N
54b11266-e2bc-4ecd-bed9-68524964f128	hoangnguyen24003@gmail.com	$2b$10$xje5twAVHIUgvgA0wBuZFeQ7Rpgk9Qq6awr0oBqMC/jVOIRSnX7AO	f	\N	\N	\N	\N	c0cfe19b-84e5-4a3d-9afc-0b2f44c5831d	\N	\N	\N	\N	2025-05-10 21:42:55.772833	2025-05-10 21:42:55.772833	\N
f9afe34e-3c2a-465d-95db-ed0e4c20f6a7	admin@vietlegal.com	$2b$10$mXJwsyYBYjIh9tT6UQL0hOEu3W5vfmfK7LeguZmvO6PwdKu7.60BC	t	\N	\N	\N	\N	c75f42c7-b6d2-45f0-b0b7-c98c979964c4	\N	\N	\N	\N	2025-05-10 22:25:34.582352	2025-05-10 22:25:34.582352	1
\.


--
-- Name: ai_models_model_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ai_models_model_id_seq', 4, true);


--
-- Name: attachments_attachment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attachments_attachment_id_seq', 21, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 2, true);


--
-- Name: ai_models PK_0a3aa499a85ecda140aa103ff27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_models
    ADD CONSTRAINT "PK_0a3aa499a85ecda140aa103ff27" PRIMARY KEY (model_id);


--
-- Name: attachments PK_0f0c0f540cbf0f2e9499f9a082e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT "PK_0f0c0f540cbf0f2e9499f9a082e" PRIMARY KEY (attachment_id);


--
-- Name: messages PK_18325f38ae6de43878487eff986; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY (id);


--
-- Name: users_data PK_821939ad6401aa5b7a015be4973; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_data
    ADD CONSTRAINT "PK_821939ad6401aa5b7a015be4973" PRIMARY KEY (id);


--
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


--
-- Name: users_login PK_e564194a9a22f8c623354284f75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_login
    ADD CONSTRAINT "PK_e564194a9a22f8c623354284f75" PRIMARY KEY (id);


--
-- Name: conversations PK_ee34f4f7ced4ec8681f26bf04ef; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY (id);


--
-- Name: users_login REL_1fdb81f35891f9412059d48a5a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_login
    ADD CONSTRAINT "REL_1fdb81f35891f9412059d48a5a" UNIQUE ("userDataId");


--
-- Name: roles UQ_648e3f5447f725579d7d4ffdfb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE (name);


--
-- Name: users_login UQ_86508703c3d1e087ae56143c1f8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_login
    ADD CONSTRAINT "UQ_86508703c3d1e087ae56143c1f8" UNIQUE (email);


--
-- Name: ai_models UQ_b2e64c27a46f4707b83ea5ee75d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_models
    ADD CONSTRAINT "UQ_b2e64c27a46f4707b83ea5ee75d" UNIQUE (name);


--
-- Name: messages FK_0f7c1e4adf172209f286cfcae2f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "FK_0f7c1e4adf172209f286cfcae2f" FOREIGN KEY (model_id) REFERENCES public.ai_models(model_id);


--
-- Name: users_login FK_1fdb81f35891f9412059d48a5a8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_login
    ADD CONSTRAINT "FK_1fdb81f35891f9412059d48a5a8" FOREIGN KEY ("userDataId") REFERENCES public.users_data(id);


--
-- Name: conversations FK_3a9ae579e61e81cc0e989afeb4a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT "FK_3a9ae579e61e81cc0e989afeb4a" FOREIGN KEY (user_id) REFERENCES public.users_login(id);


--
-- Name: messages FK_3bc55a7c3f9ed54b520bb5cfe23; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23" FOREIGN KEY (conversation_id) REFERENCES public.conversations(id);


--
-- Name: attachments FK_623e10eec51ada466c5038979e3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT "FK_623e10eec51ada466c5038979e3" FOREIGN KEY (message_id) REFERENCES public.messages(id);


--
-- Name: users_login FK_ce89e763884b190bae0eb9c5770; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_login
    ADD CONSTRAINT "FK_ce89e763884b190bae0eb9c5770" FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- PostgreSQL database dump complete
--

