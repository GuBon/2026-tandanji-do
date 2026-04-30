--
-- PostgreSQL database dump
--

\restrict PYt4mrphnfPfVs1MJi0FBlHdtlWWu1EiJNfoHOaTmH3KA3jFGCYCPyf9X4OHgfF

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

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
-- Data for Name: brands; Type: TABLE DATA; Schema: tdj; Owner: test0320
--

INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (54, '샐러디아', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (55, '샐러드식당', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (56, '샐리샐러드스토리', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (57, '보울레시피', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (58, '신선식탁', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (59, '오브밀', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (60, '저스트타임샐러드', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (61, '카페삼내음샐러디아', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (62, '역전카페', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (63, '카페완이', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (64, '삼산가맥', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (1, '이삭토스트', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (2, '참토스트', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (3, '슬로우캘리', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (4, '토스트카페마리', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (5, '토스트굽는사람들', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (6, '석바위토스트', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (7, '석봉토스트', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (8, '오늘은토스트', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (9, '냥이토스트', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (10, '킹토스트', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (11, '한끼토스트', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (12, '기남토스트', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (13, '쏘자토스트', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (14, '토스트럭', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (15, '토스트데일리', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (16, '역전토스트', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (17, '밀플랜비', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (18, '써브웨이', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (19, '죠샌드위치', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (20, '샐러딧', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (21, '샌드리아', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (22, '에그드랍', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (23, '도스마스', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (24, '얼오브샌드위치', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (25, '앤도로시샌드위치', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (26, '숲쟁이로12샌드위치', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (27, '4242샌드위치', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (28, '뻔뻔샌드위치', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (29, '샌드위치클럽', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (30, '샌드위치랩', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (31, '샌드위치온', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (32, '저스트타임샌드위치', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (33, '아메리칸트레이', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (34, '이삼옥', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (35, 'Salabread', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (36, '그린스미스', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (37, '에그존', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (38, '에그홀릭', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (39, '카페달콤차차샌드위치앤버블티', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (40, '포케올데이', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (43, '샐러드박스', NULL);
INSERT INTO tdj.brands (brand_id, brand_name, logo_url) VALUES (44, '투고샐러드', NULL);


--
-- Data for Name: stores; Type: TABLE DATA; Schema: tdj; Owner: test0320
--

INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (23, NULL, '옛날토스트', '인천광역시 서구 신석로77번길 33-1', 126.6706235, 37.5130614, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (45, NULL, '옛날토스트', '인천광역시 연수구 한나루로 171', 126.6554608, 37.4248269, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (50, 18, '서브웨이인천논현역점', '인천광역시 남동구 청능대로 583', 126.7239435, 37.4013820, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (64, NULL, '옛날토스트', '인천광역시 서구 서곶로 878', 126.6750692, 37.5954171, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (136, 5, '토스트를굽는사람들', '인천광역시 부평구 부흥로 420', 126.7386568, 37.4973414, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (123, NULL, '샐러드밥서창점', '인천광역시 남동구 서창남로 77', 126.7482477, 37.4258932, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (1, 1, '이삭토스트인천화전초교점', '인천광역시 계양구 주부토로 369', 126.7297109, 37.5274805, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (2, 58, '신선식탁송도센트럴파크점', '인천광역시 연수구 인천타워대로 251', 126.6328666, 37.3931338, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (3, 14, '토스트럭', '인천광역시 서구 청라에메랄드로41번길 31', 126.6562981, 37.5289148, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (4, 4, '토스트카페마리인천부개점', '인천광역시 부평구 수변로 60', 126.7408328, 37.4917970, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (5, 40, '포케올데이검단점', '인천광역시 서구 이음대로 378', 126.7125995, 37.5939028, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (6, 22, '에그드랍청라커널웨이점', '인천광역시 서구 청라동 162-11', 126.6529254, 37.5339351, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (7, 1, '이삭토스트인천신현점', '인천광역시 서구 원창로 200-1', 126.6716542, 37.5174881, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (8, 15, '토스트데일리', '인천광역시 연수구 인천타워대로 99', 126.6424627, 37.3811996, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (9, 1, '이삭토스트송도점', '인천광역시 연수구 송도미래로 30', 126.6484429, 37.3668853, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (10, 1, '이삭토스트인천신기시장점', '인천광역시 미추홀구 미추홀대로 577', 126.6793692, 37.4487943, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (11, 1, '이삭토스트구월아시아드점', '인천광역시 남동구 인하로 616', 126.7152048, 37.4425240, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (12, 1, '이삭토스트구월길병원점', '인천광역시 남동구 구월남로 174', 126.7090761, 37.4528059, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (13, 40, '포케올데이연수점', '인천광역시 연수구 벚꽃로 114', 126.6781248, 37.4170791, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (14, 1, '이삭토스트인천청라점', '인천광역시 서구 청라라임로 51', 126.6529239, 37.5321316, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (15, 59, '오브밀', '인천광역시 서구 청라에메랄드로 99', 126.6557308, 37.5336073, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (16, 40, '포케올데이주안점', '인천광역시 미추홀구 경인로 340', 126.6778017, 37.4584167, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (17, 22, '에그드랍청라국제업무단지점', '인천광역시 서구 청라한내로100번길 10', 126.6285605, 37.5338210, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (18, 1, '이삭토스트부평역점', '인천광역시 부평구 광장로 15', 126.7234864, 37.4904473, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (19, 1, '이삭토스트용현점', '인천광역시 미추홀구 낙섬중로 1', 126.6350107, 37.4490603, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (20, 22, '에그드랍인하대점', '인천광역시 미추홀구 인하로77번길 22', 126.6575101, 37.4520636, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (21, 22, '에그드랍구월힐캐슬점', '인천광역시 남동구 구월로 212', 126.7140509, 37.4560189, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (22, 18, '써브웨이연수점', '인천광역시 연수구 먼우금로 194', 126.6770179, 37.4143480, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (24, 30, '샌드위치랩', '인천광역시 계양구 오조산로45번길 7', 126.7377566, 37.5348301, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (25, 1, '이삭토스트서창2지구점', '인천광역시 남동구 서창남로 46', 126.7508341, 37.4236757, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (26, 18, '써브웨이인천완정역점', '인천광역시 서구 서곶로 837', 126.6729890, 37.5920754, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (27, 18, '써브웨이인천서창점', '인천광역시 남동구 서창남로 41', 126.7503634, 37.4231945, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (28, 25, '앤도로시샌드위치&삼산가맥', '인천광역시 부평구 평천로 386', 126.7331077, 37.5173042, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (29, 16, '역전토스트&카페', '인천광역시 미추홀구 염창로 58', 126.6804762, 37.4655438, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (30, 1, '이삭토스트인천소래점', '인천광역시 남동구 포구로 77', 126.7355431, 37.4051421, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (31, 40, '포케올데이영종도점', '인천광역시 중구 햇내로안길 14-6', 126.4987824, 37.4948970, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (32, 18, '써브웨이인천영종점', '인천광역시 중구 하늘별빛로 75', 126.5628030, 37.4898111, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (33, 40, '포케올데이송도센트로드점', '인천광역시 연수구 인천타워대로 323', 126.6301759, 37.3992142, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (34, 1, '이삭토스트라피에스타점', '인천광역시 남동구 논고개로 61', 126.7275277, 37.3975366, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (35, 18, '써브웨이인천성모병원점', '인천광역시 부평구 동수로 49', 126.7240402, 37.4853946, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (36, 1, '이삭토스트인천동암북부점', '인천광역시 부평구 동암광장로4번길 3', 126.7019503, 37.4708335, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (37, 26, '숲쟁이로12샌드위치', '인천광역시 중구 자연대로 37', 126.5598887, 37.4881823, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (38, 23, '도스마스롯데캐슬캠퍼스타운점', '인천광역시 연수구 송도과학로27번길 55', 126.6650322, 37.3881981, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (39, 31, '샌드위치온', '인천광역시 남동구 미래로 6', 126.7050731, 37.4506397, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (40, 18, '써브웨이송도점', '인천광역시 연수구 신송로 122', 126.6524290, 37.3958290, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (41, 23, '도스마스인천대점', '인천광역시 연수구 하모니로 271', 126.6366277, 37.3739459, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (42, 13, '티앤아이네트웍스쏘자토스트부평점', '인천광역시 부평구 부평동 665-166', 126.7230280, 37.4847296, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (43, 40, '포케올데이인하대역점', '인천광역시 미추홀구 독배로 311', 126.6491201, 37.4481463, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (44, 4, '토스트카페마리영종하늘도시점', '인천광역시 중구 하늘달빛로 82', 126.5583506, 37.4866331, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (46, 40, '포케올데이청라점', '인천광역시 서구 청라커낼로233번길 3-4', 126.6441505, 37.5290079, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (47, 18, '써브웨이인천송도지웰푸르지오시티점', '인천광역시 연수구 하모니로 144', 126.6432799, 37.3843527, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (48, 57, '보울레시피송도점', '인천광역시 연수구 센트럴로 313', 126.6315176, 37.4016263, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (49, 18, '써브웨이부평중앙점', '인천광역시 부평구 부평문화로 63', 126.7232257, 37.4941406, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (51, 54, '샐러디아검단신도시점', '인천광역시 서구 이음5로 65', 126.7141321, 37.5968592, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (52, 1, '이삭토스트인천더샵부평점', '인천광역시 부평구 열우물로 90', 126.6979628, 37.4770644, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (53, 1, '이삭토스트삼산점', '인천광역시 부평구 영성로 50-1', 126.7448924, 37.5199284, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (54, 19, '죠샌드위치운서역점', '인천광역시 중구 영종대로 94', 126.4895820, 37.4949114, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (55, 1, '이삭토스트인천검암로열푸르지오점', '인천광역시 서구 백석동 122-4', 126.6707890, 37.5792670, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (56, 3, '슬로우캘리인하대점', '인천광역시 미추홀구 경인남길30번길 62', 126.6577264, 37.4514854, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (57, 1, '이삭토스트인하대점', '인천광역시 미추홀구 인하로 83', 126.6576598, 37.4512233, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (58, 1, '이삭토스트', '인천광역시 남동구 인주대로 582', 126.7016055, 37.4497834, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (59, 23, '도스마스', '인천광역시 서구 장고개로337번길 16', 126.6853525, 37.4931242, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (60, 33, '아메리칸트레이부평본점', '인천광역시 부평구 부평문화로 70-2', 126.7239701, 37.4938884, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (61, 18, '써브웨이계양구청점', '인천광역시 계양구 계산새로 85', 126.7375642, 37.5382200, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (62, 18, '써브웨이인천서구청점', '인천광역시 서구 탁옥로 50', 126.6750358, 37.5437287, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (63, 28, '뻔뻔샌드위치', '인천광역시 부평구 부평문화로 144', 126.7323059, 37.4938523, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (65, 2, '참토스트숭의점', '인천광역시 미추홀구 낙섬중로 129', 126.6423167, 37.4587874, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (66, 54, '샐러디아청라점', '인천광역시 서구 청라에메랄드로 99', 126.6557308, 37.5336073, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (67, 3, '슬로우캘리영종하늘도시점', '인천광역시 중구 하늘중앙로195번길 23', 126.5621830, 37.4892266, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (68, 2, '참토스트', '인천광역시 미추홀구 주안로 170', 126.6887094, 37.4632947, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (69, 27, '4242샌드위치검단신도시점', '인천광역시 서구 이음대로 384', 126.7126374, 37.5935306, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (70, 1, '이삭토스트인천청천점', '인천광역시 부평구 청천동 481', 126.7029096, 37.5157941, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (71, 4, '토스트카페마리송도캠퍼스타운점', '인천광역시 연수구 송도과학로27번길 55', 126.6650322, 37.3881981, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (72, 61, '카페삼내음샐러디아구월점', '인천광역시 남동구 선수촌공원로23번길 12', 126.7086154, 37.4412227, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (73, 29, '샌드위치클럽', '인천광역시 중구 오작로 40', 126.5614253, 37.4964664, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (74, 40, '포케올데이인천논현점', '인천광역시 남동구 논고개로 81', 126.7259041, 37.3986866, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (75, 56, '샐리샐러드스토리청라점', '인천광역시 서구 중봉대로586번길 22', 126.6515468, 37.5314452, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (76, 1, '이삭토스트계양구청점', '인천광역시 계양구 계양문화로 86', 126.7371321, 37.5383265, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (77, 3, '슬로우캘리영종합동청사점', '인천광역시 중구 공항로424번길 60', 126.4610457, 37.4388991, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (78, 40, '포케올데이송도트리플타워점', '인천광역시 연수구 송도과학로28번길 50', 126.6576919, 37.3793499, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (79, 38, '에그홀릭대동월드점', '인천광역시 연수구 용담로 153', 126.6814138, 37.4132869, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (80, 18, '써브웨이인천운서메가스타점', '인천광역시 중구 신도시남로142번길 6', 126.4914898, 37.4934207, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (81, 1, '이삭토스트인천부평점', '인천광역시 부평구 경원대로 1410', 126.7256379, 37.4910245, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (82, 1, '이삭토스트영종하늘도시점', '인천광역시 중구 하늘중앙로195번길 14', 126.5607803, 37.4893615, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (83, 54, '샐러디아부평점', '인천광역시 부평구 경원대로 1366', 126.7206379, 37.4909756, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (84, 2, '참토스트인천시청점', '인천광역시 남동구 남동대로799번길 34', 126.7069356, 37.4542045, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (85, 24, '얼오브샌드위치롯데백화점인천점', '인천광역시 미추홀구 연남로 35', 126.7013784, 37.4424853, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (86, 1, '이삭토스트가좌점', '인천광역시 서구 원적로 96', 126.6826030, 37.4947818, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (87, 1, '이삭토스트청라호수공원점', '인천광역시 서구 청라루비로 93', 126.6401518, 37.5334178, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (88, 21, '샌드리아간석점', '인천광역시 남동구 호구포로 894-1', 126.7206682, 37.4621596, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (89, 18, '써브웨이인천삼산점', '인천광역시 부평구 체육관로 24', 126.7342964, 37.5083367, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (90, 18, '써브웨이인천검단사거리점', '인천광역시 서구 완정로 159', 126.6584027, 37.6015355, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (91, 40, '포케올데이용현점', '인천광역시 미추홀구 용정공원로83번길 43', 126.6476339, 37.4474982, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (92, 1, '이삭토스트검단아라점', '인천광역시 서구 이음대로 378', 126.7125995, 37.5939028, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (93, 39, '카페달콤차차샌드위치앤버블티', '인천광역시 부평구 영성서로 38', 126.7429815, 37.5214833, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (94, 40, '포케올데이구월점', '인천광역시 남동구 남동대로799번길 34', 126.7069356, 37.4542045, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (95, 6, '석바위토스트청라점', '인천광역시 서구 푸른로8번안길 4', 126.6295431, 37.5251851, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (96, 54, '샐러디아&카페완이용현점', '인천광역시 미추홀구 토금남로33번길 25', 126.6367087, 37.4526295, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (97, 23, '도스마스영종하늘도시점', '인천광역시 중구 자연대로 41', 126.5595415, 37.4884026, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (98, 40, '포케올데이부평점', '인천광역시 부평구 대정로 24', 126.7239277, 37.4967539, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (99, 38, '에그홀릭부평점', '인천광역시 부평구 부평대로63번길 8', 126.7218155, 37.4971479, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (100, 3, '슬로우캘리부평점', '인천광역시 부평구 부평대로71번길 10-11', 126.7214172, 37.4981220, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (101, 18, '써브웨이인천인하대점', '인천광역시 미추홀구 용현동 253-4', 126.6538126, 37.4507292, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (102, 18, '써브웨이송도센트럴파크점', '인천광역시 연수구 센트럴로 194', 126.6404079, 37.3951272, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (103, 1, '이삭토스트동춘점', '인천광역시 연수구 앵고개로 260', 126.6723036, 37.4076689, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (104, 1, '이삭토스트송도퍼스트파크점', '인천광역시 연수구 컨벤시아대로230번길 54', 126.6340327, 37.3890112, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (105, 1, '이삭토스트송도더테라스점', '인천광역시 연수구 센트럴로 415', 126.6269233, 37.4105318, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (106, 18, '써브웨이청라점', '인천광역시 서구 청라라임로 65', 126.6529865, 37.5334397, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (107, 1, '이삭토스트', '인천광역시 부평구 부개동 13-120', 126.7360282, 37.5028915, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (108, 18, '써브웨이인천부평시장역점', '인천광역시 부평구 부흥로 264', 126.7211007, 37.4983356, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (109, 3, '슬로우캘리인천구월점', '인천광역시 남동구 남동대로765번길 25', 126.7061034, 37.4506118, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (110, 2, '참토스트송도하버뷰점', '인천광역시 연수구 해돋이로 168', 126.6452057, 37.3954335, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (111, 21, '샌드리아영종하늘도시점', '인천광역시 중구 하늘달빛로 139', 126.5511969, 37.4884802, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (112, 40, '포케올데이영종하늘도시점', '인천광역시 중구 하늘중앙로195번길 21', 126.5618283, 37.4894563, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (113, 1, '이삭토스트작전점', '인천광역시 계양구 효서로 385', 126.7391625, 37.5279500, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (114, 19, '죠샌드위치&샐러딧인천시청점', '인천광역시 남동구 예술로192번길 30', 126.7029016, 37.4509088, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (115, 18, '써브웨이인천신포점', '인천광역시 중구 우현로35번길 26', 126.6250354, 37.4710668, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (116, 55, '샐러드식당만수점', '인천광역시 남동구 백범로124번길 7', 126.7333928, 37.4555579, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (117, 19, '죠샌드위치앤샐러딧인천아인여성병원점', '인천광역시 미추홀구 경인로 372', 126.6811634, 37.4573949, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (118, 3, '슬로우캘리인천계산점', '인천광역시 계양구 계양대로 214', 126.7230321, 37.5430595, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (119, 40, '포케올데이계양구청점', '인천광역시 계양구 오조산공원로 26', 126.7377019, 37.5397131, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (120, 1, '이삭토스트인천옥련점', '인천광역시 연수구 독배로 49', 126.6443560, 37.4250619, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (121, 18, '써브웨이인천가정중앙점', '인천광역시 서구 가정로 388', 126.6733803, 37.5194550, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (122, 3, '슬로우캘리송도점', '인천광역시 연수구 하모니로 158', 126.6422608, 37.3832893, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (124, 1, '이삭토스트', '인천광역시 부평구 수변로 20', 126.7402704, 37.4880577, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (125, 18, '써브웨이인천송도트리플스트리트점', '인천광역시 연수구 송도과학로16번길 33-3', 126.6609571, 37.3797884, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (126, 4, '토스트카페마리인천학익점', '인천광역시 미추홀구 한나루로 420', 126.6659833, 37.4446655, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (127, 13, '쏘자토스트', '인천광역시 미추홀구 한나루로 400', 126.6649652, 37.4435149, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (128, 54, '샐러디아운서점', '인천광역시 중구 영종대로 173', 126.4984975, 37.4937056, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (129, 1, '이삭토스트인천운서역점', '인천광역시 중구 신도시남로142번길 6', 126.4917303, 37.4935101, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (130, 1, '이삭토스트만수1동점', '인천광역시 남동구 복개동로 42', 126.7262684, 37.4517119, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (131, 1, '이삭토스트', '인천광역시 서구 검단로 467', 126.6562799, 37.6018276, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (132, 1, '이삭토스트', '인천광역시 연수구 새말로 107', 126.6811838, 37.4186672, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (133, 11, '한끼토스트', '인천광역시 미추홀구 소성로350번길 16', 126.6858384, 37.4366222, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (134, 43, '샐러드박스검암점', '인천광역시 서구 승학로 497', 126.6749543, 37.5655839, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (135, 1, '이삭토스트', '인천광역시 부평구 원적로 292', 126.6987319, 37.5043615, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (137, 1, '이삭토스트', '인천광역시 계양구 효서로 57', 126.7020043, 37.5278130, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (138, 18, '써브웨이인천주안역점', '인천광역시 미추홀구 주안로 89', 126.6793266, 37.4643783, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (139, 1, '이삭토스트', '인천광역시 중구 참외전로 124', 126.6309345, 37.4753592, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (140, 5, '토스트굽는사람들', '인천광역시 미추홀구 인주대로 261', 126.6658046, 37.4530363, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (141, 1, '이삭토스트만수향촌점', '인천광역시 남동구 만수서로 62', 126.7330584, 37.4614272, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (142, 18, '써브웨이인천동암점', '인천광역시 부평구 열우물로 45', 126.7004358, 37.4721115, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (143, 6, '석바위토스트', '인천광역시 미추홀구 경인로485번길 17', 126.6928882, 37.4602459, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (144, 8, '오늘은토스트', '인천광역시 중구 항동7가 축항대로86번길 38', 126.6047018, 37.4535871, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (145, 1, '이삭토스트인천갈산점', '인천광역시 부평구 주부토로 179', 126.7258696, 37.5112220, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (146, 26, '숲쟁이로12샌드위치', '인천광역시 중구 숲쟁이로 12', 126.5138945, 37.4781190, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (147, 1, '이삭토스트', '인천광역시 계양구 경명대로1045번길 15', 126.7228400, 37.5450211, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (148, 7, '석봉토스트', '인천광역시 부평구 육동로 2', 126.7248025, 37.4855526, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (149, 1, '이삭토스트가정루원시티점', '인천광역시 서구 봉오재3로 96', 126.6703604, 37.5271963, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (150, 9, '냥이토스트', '인천광역시 미추홀구 낙섬중로46번길 8', 126.6383163, 37.4518846, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (151, 18, '써브웨이인천모래내시장역점', '인천광역시 남동구 호구포로 818', 126.7196910, 37.4553712, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (152, 18, '써브웨이인천산곡역점', '인천광역시 부평구 길주로364번길 9', 126.7025566, 37.5080267, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (153, 18, '써브웨이인천갈산점', '인천광역시 부평구 주부토로 236', 126.7268033, 37.5158606, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (154, 1, '이삭토스트', '인천광역시 계양구 장제로 899', 126.7399534, 37.5470052, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (155, 17, '밀플랜비', '인천광역시 미추홀구 인하로77번길 6-19', 126.6576874, 37.4513493, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (156, 1, '이삭토스트', '인천광역시 남동구 용천로 82', 126.7150431, 37.4569462, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (157, 18, '써브웨이계산역점', '인천광역시 계양구 경명대로 1055', 126.7242851, 37.5437622, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (158, 1, '이삭토스트인천송도글로벌캠퍼스점', '인천광역시 연수구 송도문화로28번길 28', 126.6536904, 37.3766923, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (159, 10, '킹토스트', '인천광역시 부평구 화랑로 14', 126.7059279, 37.4873378, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (160, 1, '이삭토스트동수역점', '인천광역시 부평구 경인로 885', 126.7185509, 37.4857119, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (161, 40, '포케올데이송도1공구점', '인천광역시 연수구 신송로 170', 126.6489111, 37.3988724, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (162, 1, '이삭토스트', '인천광역시 서구 승학로512번길 2', 126.6763881, 37.5652364, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (163, 44, '투고샐러드부평갈산점', '인천광역시 부평구 주부토로 236', 126.7268033, 37.5158606, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (164, 12, '기남토스트', '인천광역시 중구 참외전로 131-12', 126.6321090, 37.4749696, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (165, 60, '저스트타임샐러드&샌드위치', '인천광역시 중구 운서로7번길 15', 126.5003932, 37.4945930, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (166, 1, '이삭토스트간석벽산점', '인천광역시 남동구 호구포로 921', 126.7205565, 37.4647463, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (167, 1, '이삭토스트인천도화점', '인천광역시 미추홀구 숙골로 94', 126.6633194, 37.4706364, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (168, 1, '이삭토스트', '인천광역시 부평구 체육관로 38', 126.7358105, 37.5082844, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (169, 1, '이삭토스트만수3지구점', '인천광역시 남동구 장승남로 39', 126.7366189, 37.4436396, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (170, 1, '이삭토스트인천산곡고점', '인천광역시 부평구 부영로189번길 36', 126.7138868, 37.5024204, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (171, 35, '이삼옥&샐러브래드이삼옥&Salabread', '인천광역시 부평구 부평대로32번길 32-1', 126.7248453, 37.4944070, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (172, 1, '이삭토스트인천호구포역점', '인천광역시 남동구 논현로26번길 15', 126.7093470, 37.4023017, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (173, 36, '그린스미스&에그존운서점', '인천광역시 중구 영종대로196번길 25', 126.4990827, 37.4900380, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');
INSERT INTO tdj.stores (store_id, brand_id, store_name, address, longitude, latitude, category, created_at) VALUES (174, 5, '토스트굽는사람들', '인천광역시 서구 서달로163번길 1', 126.6784975, 37.5130549, '토스트/샌드위치/샐러드', '2026-04-30 09:24:18.024372');


--
-- Data for Name: menus; Type: TABLE DATA; Schema: tdj; Owner: test0320
--

INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (1, 1, NULL, '햄치즈토스트', 420, 48, 19, 17, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (2, 1, NULL, '햄스페셜 토스트', 428, 57, 19, 16, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (3, 1, NULL, '스크램블햄치즈', 530, 51, 24, 25, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (4, 1, NULL, '스페셜토스트', 428, 57, 19, 10, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (5, 1, NULL, '베이컨 포테이토 피자 토스트', 673, 70, 32, 25, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (6, 1, NULL, '포테이토 팝', 177, 30, 3, 5, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (7, 1, NULL, '햄치즈포테이토', 545, 63, 20, 24, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (8, 1, NULL, '프렌치햄치즈', 418, 39, 17, 21, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (9, 1, NULL, '그릴드 불갈비', 719, 54, 18, 44, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (10, 1, NULL, '베이컨베스트', 574, 55, 21, 30, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (11, 1, NULL, '딥치즈베이컨', 446, 48, 19, 17, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (12, 1, NULL, '딥치즈베이컨포테이토', 460, 50, 10, 40, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (13, 1, NULL, '감자 토스트', 612, 62, 10, 36, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (14, 1, NULL, '햄치즈', 552, 48, 18, 32, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (15, 1, NULL, '스크램블베이컨', 631, 58, 32, 29, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (16, 1, NULL, '리얼 양념치킨', 641, 62, 31, 29, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (17, 1, NULL, '프렌치 에그마요', 639, 53, 21, 38, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (18, 1, NULL, '콘베이컨 에그마요', 493, 52, 15, 25, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (19, 1, NULL, '새우토스트', 623, 20, 18, 10, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (20, 1, NULL, '소이크런치치킨', 762, 81, 31, 36, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (21, 1, NULL, '치즈팝', 246, 32, 7, 10, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (22, 1, NULL, '소이 크런치 치킨', 762, 81, 31, 36, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (23, 1, NULL, '햄치즈 치아바타', 373, 30, 16, 21, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (24, 1, NULL, '계란후라이 햄치즈', 530, 51, 24, 25, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (25, 1, NULL, '피자토스트', 452, 51, 23, 21, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (26, 1, NULL, '치킨스페셜', 733, 78, 33, 32, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (27, 1, NULL, '불고기스페셜', 576, 58, 26, 26, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (28, 1, NULL, '피자부리또', 395, 45, 13, 18, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (29, 1, NULL, '코울슬로', 215, 33, 1, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (30, 1, NULL, '버터토스트칩', 156, 26, 4, 4, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (31, 1, NULL, '모짜올리구마', 420, 120, 25, 30, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (32, 1, NULL, '더블치즈불고기', 639, 53, 29, 35, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (33, 1, NULL, '핫베이컨치킨', 320, 16, 60, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (34, 1, NULL, '비프라구토스트', 348, 45, 15, 12, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (35, 1, NULL, '햄치즈베이크', 248, 24, 11, 12, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (36, 3, NULL, '클래식 연어 포케', 569, 79, 30, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (37, 3, NULL, '연어포케', 569, 79, 30, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (38, 3, NULL, '클래식 연어 포케(현미밥)', 581, 79, 33, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (39, 3, NULL, '부채살 스테이크 보울', 638, 63, 39, 16, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (40, 3, NULL, '블랙페퍼 치킨 보울(현미밥+샐러드)', 665, 58, 48, 27, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (41, 3, NULL, '스파이시 연어 포케', 605, 85, 31, 16, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (42, 3, NULL, '클래식 참치 포케', 467, 55, 32, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (43, 3, NULL, '닭가슴살 에그 포케(현미밥)', 508, 53, 38, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (44, 3, NULL, '부채살 스테이크 보울 (샐러드)', 401, 24, 34, 19, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (45, 3, NULL, '부채살 스테이크 보울(현미밥)', 638, 63, 39, 16, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (46, 3, NULL, '스파이시 참치 포케', 569, 87, 29, 12, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (47, 3, NULL, '클래식 연어포케 샐러드', 287, 32, 22, 8, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (48, 3, NULL, '로스팅 닭다리살 샐러드', 323, 31, 18, 14, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (49, 3, NULL, '올인원 포케(클래식) 현미밥', 610, 43, 40, 28, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (50, 3, NULL, '블랙페퍼 치킨 보울 : 현미밥', 632, 43, 48, 27, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (51, 3, NULL, '스파이시 토마토 야채스프', 91, 16, 3, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (52, 3, NULL, '클래식 연어 포케(샐러드)', 451, 14, 25, 29, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (53, 3, NULL, '솔트앤페퍼 참치 포케', 605, 86, 30, 16, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (54, 3, NULL, '클래식참치포케', 543, 82, 30, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (55, 3, NULL, '클래식 연어포케(메밀면)', 574, 57, 25, 28, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (56, 3, NULL, '닭가슴살 에그 통밀랩', 409, 31, 27, 16, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (57, 3, NULL, '스파이시 연어 포케(현미밥)', 645, 59, 27, 30, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (58, 3, NULL, '블랙페퍼 치킨 통밀랩', 481, 36, 29, 21, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (59, 3, NULL, '오리엔탈 두부포케', 551, 92, 15, 13, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (60, 3, NULL, '오리엔탈 두부 포케 샐러드', 273, 41, 11, 7, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (61, 3, NULL, '라임폰즈 문어 포케', 486, 79, 24, 8, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (62, 3, NULL, '클래식연어포케', 569, 79, 30, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (63, 3, NULL, '클래식 참치 포케 샐러드', 288, 15, 30, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (64, 3, NULL, '하와이안 갈릭 쉬림프 현미밥', 669, 87, 32, 18, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (65, 3, NULL, '블랙페퍼 치킨 보울', 911, 130, 49, 22, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (66, 3, NULL, '닭가슴살 에그 샐러드', 330, 29, 36, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (67, 3, NULL, '부채살 스테이크 통밀랩', 512, 38, 29, 24, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (68, 3, NULL, '오리엔탈 두부 포케 현미밥', 510, 66, 17, 17, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (69, 3, NULL, '클래식 참치 포케(현미밥)', 467, 55, 32, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (70, 3, NULL, '클래식 연어 포케 : 현미밥', 630, 54, 27, 31, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (71, 3, NULL, '부채살 스테이크 보울(메밀면)', 588, 64, 38, 20, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (72, 3, NULL, '스파이시 연어 포케 (샐러드)', 300, 34, 20, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (73, 3, NULL, '블랙페퍼 치킨 보울 (메밀면)', 732, 63, 54, 26, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (74, 3, NULL, '프리미엄 연어 스테이크', 885, 111, 44, 30, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (75, 3, NULL, '닭가슴살에그포케', 508, 53, 38, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (76, 3, NULL, '스파이시 연어 포케(메밀면)', 745, 79, 33, 29, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (77, 3, NULL, '블랙페퍼 치킨 보울 (샐러드)', 556, 64, 43, 14, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (78, 3, NULL, '베이컨 포테이토 스프', 119, 11, 4, 7, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (79, 3, NULL, '트러플 버섯 포케', 465, 82, 15, 8, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (80, 3, NULL, '탄단지데이 샐러드', 288, 24, 21, 12, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (81, 3, NULL, '와사비 렌치 연어 포케', 688, 73, 21, 32, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (82, 3, NULL, '스파이시 참치 샐러드', 285, 37, 20, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (83, 3, NULL, '스파이시 참치 포케 : 현미밥', 513, 60, 33, 13, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (84, 3, NULL, '클래식 참치 포케 : 메밀면', 567, 75, 37, 10, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (85, 3, NULL, '솔트앤페퍼 참치 포케 (샐러드)', 352, 16, 31, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (86, 3, NULL, '올인원 포케(클래식) : 메밀면', 710, 63, 46, 26, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (87, 3, NULL, '크런치 시저 샐러드', 190, 16, 17, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (88, 3, NULL, '연어 아보카도 통밀랩', 474, 32, 19, 27, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (89, 3, NULL, '부채살스테이크통밀랩', 512, 38, 29, 24, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (90, 3, NULL, '닭가슴살 에그 포케 메밀면', 608, 73, 43, 10, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (91, 3, NULL, '클래식참치샐러드', 288, 15, 30, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (92, 3, NULL, '라임폰즈 문어 포케 메밀면', 567, 75, 35, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (93, 3, NULL, '클래식 참치 포케 : 현미밥', 467, 55, 32, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (94, 3, NULL, '미소 치킨 스프', 64, 2, 11, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (95, 3, NULL, '하와이안 갈릭 쉬림프', 1090, 135, 36, 45, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (96, 3, NULL, '라임폰즈 문어 포케(샐러드만)', 239, 33, 17, 4, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (97, 3, NULL, '라임폰즈 문어 포케(현미밥)', 467, 55, 29, 12, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (98, 3, NULL, '스파이시 참치 포케(메밀면)', 613, 80, 39, 12, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (99, 3, NULL, '하와이안 로코모코(현미밥)', 826, 89, 31, 35, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (100, 3, NULL, '식단면', 130, 15, 24, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (101, 3, NULL, '스파이시 참치 포케 메밀면', 613, 80, 39, 12, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (102, 18, NULL, '로스트치킨', 320, 8, 23, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (103, 18, NULL, '올리브 오일', 45, 0, 0, 5, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (104, 18, NULL, '슈레드 치즈', 54, 0, 3, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (105, 18, NULL, '초코칩쿠키', 228, 30, 2, 10, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (106, 18, NULL, '아메리칸 치즈', 35, 0, 2, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (107, 18, NULL, '스위트칠리', 30, 8, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (108, 18, NULL, '로티세리 바비큐 치킨', 350, 7, 29, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (109, 18, NULL, '참치', 316, 0, 27, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (110, 18, NULL, '스테이크&치즈', 380, 0, 26, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (111, 18, NULL, '오믈렛', 120, 0, 9, 3, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (112, 18, NULL, '사우스웨스트 치폴레', 97, 1, 0, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (113, 18, NULL, '이탈리안 비엠티', 388, 46, 21, 16, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (114, 18, NULL, '스위트어니언', 40, 8, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (115, 18, NULL, '써브웨이 클럽', 299, 46, 20, 5, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (116, 18, NULL, '에그마요 추가', 205, 1, 5, 7, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (117, 18, NULL, '라즈베리 치즈케익 쿠키', 204, 29, 2, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (118, 18, NULL, '풀드 포크 바비큐', 327, 47, 25, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (119, 18, NULL, '화이트 초코 마카다미아', 245, 19, 2, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (120, 18, NULL, '안창비프머쉬룸', 292, 45, 17, 8, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (121, 18, NULL, '로티세리 치킨 샐러드', 170, 6, 23, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (122, 18, NULL, '터키', 259, 9, 18, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (123, 18, NULL, '핫 칠리', 42, 5, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (124, 18, NULL, '머쉬룸', 245, 8, 12, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (125, 18, NULL, '비엘티', 380, 7, 20, 5, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (126, 18, NULL, '모짜렐라 치즈', 44, 0, 3, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (127, 18, NULL, '허니머스타드', 38, 6, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (128, 18, NULL, '레드와인식초', 40, 1, 0, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (129, 18, NULL, '스모크 바베큐', 33, 7, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (130, 18, NULL, '로스트 치킨 아보카도', 357, 9, 27, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (131, 18, NULL, '햄 샌드위치', 262, 8, 19, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (132, 18, NULL, '페퍼로니 피자 썹', 436, 9, 19, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (133, 18, NULL, '쉬림프 샐러드', 67, 7, 7, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (134, 18, NULL, '로스트 치킨 샐러드', 138, 8, 19, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (135, 18, NULL, '베지샐러드', 60, 0, 3, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (136, 18, NULL, 'New 스파이시 쉬림프', 245, 9, 17, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (137, 18, NULL, '참치 샐러드', 153, 7, 20, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (138, 18, NULL, '스테이크 & 치즈 찹샐러드', 210, 8, 20, 4, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (139, 18, NULL, '브로콜리 체다 수프', 170, 4, 5, 5, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (140, 18, NULL, '스모크 바비큐', 33, 7, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (141, 18, NULL, '스모어스 쿠키', 230, 20, 2, 4, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (142, 18, NULL, '치킨 브레스트', 90, 2, 15, 3, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (143, 18, NULL, '스파이시 쉬림프 아보카도', 289, 9, 14, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (144, 18, NULL, '치킨 데리야끼 샐러드', 152, 10, 20, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (145, 18, NULL, '써브웨이 클럽 샐러드', 138, 8, 13, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (146, 18, NULL, '터키 샐러드', 97, 8, 12, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (147, 18, NULL, '치킨슬라이스', 265, 9, 19, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (148, 18, NULL, '잠봉 플러스', 475, 45, 24, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (149, 18, NULL, '치킨 슬라이스 샐러드', 103, 8, 12, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (150, 22, NULL, '아메리칸햄치즈', 609, 40, 31, 13, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (151, 22, NULL, '미스터에그', 511, 8, 25, 10, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (152, 22, NULL, '갈릭 베이컨 치즈', 658, 62, 21, 13, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (153, 22, NULL, '햄앤치즈 프렌치토스트', 604, 16, 16, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (154, 22, NULL, '베이컨 더블 치즈', 598, 62, 22, 14, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (155, 22, NULL, '아보홀릭', 533, 14, 16, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (156, 22, NULL, '치킨클럽샌드위치', 374, 8, 17, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (157, 22, NULL, '클럽샌드위치', 381, 14, 14, 5, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (158, 22, NULL, '데리야끼 바베큐', 665, 5, 31, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (159, 22, NULL, '타마고산도', 235, 29, 12, 8, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (160, 22, NULL, '랜치 드레싱', 155, 5, 1, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (161, 22, NULL, '베이컨 딥 치즈 번', 646, 40, 23, 20, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (162, 22, NULL, '아보 베이컨 길거리 토스트', 607, 40, 22, 5, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (163, 22, NULL, '닭가슴살 에그 콥 샐러드', 207, 10, 17, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (164, 22, NULL, '반했드랍', 70, 1, 6, 5, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (165, 22, NULL, '리얼 에그 콥 샐러드', 285, 6, 17, 3, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (166, 22, NULL, '리코타 그래놀라 샐러드', 285, 31, 11, 13, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (167, 22, NULL, '리얼 치킨 콥 샐러드', 235, 6, 17, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (168, 22, NULL, '쓰리라찹', 15, 2, 0, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (169, 23, NULL, '부리또', 253, 41, 9, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (170, 23, NULL, '오리지널 라이스 부리또', 360, 41, 18, 14, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (171, 23, NULL, '섞어부리또', 600, 80, 25, 20, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (172, 23, NULL, '하와이안 포테이토 부리또', 430, 44, 18, 20, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (173, 23, NULL, '믹스부리또', 423, 60, 12, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (174, 33, NULL, '오트 그래놀라 클래식', 156, 16, 4, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (175, 40, NULL, '현미밥포케', 403, 65, 12, 7, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (176, 40, NULL, '육회', 136, 1, 14, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (177, 40, NULL, '메밀면포케', 414, 59, 13, 14, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (178, 40, NULL, '곡물밥포케', 465, 68, 14, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (179, 40, NULL, '스리라차마요', 168, 8, 0, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (180, 40, NULL, '구운 버섯', 25, 4, 3, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (181, 40, NULL, '연어', 74, 0, 14, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (182, 40, NULL, '육회 프로틴 포케', 812, 94, 38, 31, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (183, 40, NULL, '닭가슴살', 84, 3, 14, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (184, 40, NULL, '채소만 포케', 261, 29, 8, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (185, 40, NULL, '와사비 간장', 42, 8, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (186, 40, NULL, '훈제오리', 200, 2, 11, 16, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (187, 40, NULL, '스파이시 연어 참치 프로틴 포케', 731, 101, 35, 21, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (188, 40, NULL, '구운 새우', 56, 0, 13, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (189, 40, NULL, '육회 들기름 메밀면 샐러드', 729, 79, 21, 37, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (190, 40, NULL, '참깨간장', 50, 10, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (191, 40, NULL, '불고기', 116, 4, 11, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (192, 40, NULL, '게살', 26, 4, 3, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (193, 40, NULL, '스테이크', 252, 0, 20, 19, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (194, 40, NULL, '단호박스프', 210, 31, 3, 8, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (195, 40, NULL, '들기름 메밀면 샐러드', 663, 79, 13, 33, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (196, 40, NULL, '초계란말이', 23, 1, 2, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (197, 40, NULL, '직화닭다리살', 135, 4, 14, 7, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (198, 40, NULL, '아보카도', 102, 3, 1, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (199, 40, NULL, '새우', 65, 0, 13, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (200, 40, NULL, '참깨간장소스', 50, 10, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (201, 40, NULL, '닭가슴살 아보카도 낫또 프로틴 포케', 955, 105, 52, 36, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (202, 40, NULL, '저당 참깨 소스', 136, 6, 1, 12, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (203, 40, NULL, '두부볼(불고기)', 173, 11, 14, 8, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (204, 40, NULL, '메밀면 추가', 133, 28, 4, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (205, 40, NULL, '곡물밥', 465, 68, 14, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (206, 40, NULL, '스파이시 참치', 78, 4, 14, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (207, 40, NULL, '연어 토핑', 60, 0, 12, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (208, 40, NULL, '크리미 어니언 치킨 랩', 325, 40, 16, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (209, 40, NULL, '육회메밀면샐러드', 663, 80, 25, 28, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (210, 40, NULL, '불고기새우 포케타코', 258, 27, 15, 10, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (211, 40, NULL, '유자간장', 80, 19, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (212, 40, NULL, '참치', 96, 0, 20, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (213, 40, NULL, '해초', 24, 2, 1, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (214, 40, NULL, '통들깨 들기름 메밀면 샐러드', 663, 79, 13, 33, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (215, 40, NULL, '스파이시 연어', 64, 4, 10, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (216, 40, NULL, '로제 소스', 49, 5, 1, 3, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (217, 40, NULL, '훈제꼬들목살', 232, 7, 8, 19, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (218, 40, NULL, '랍스타 크런치 랩', 267, 38, 10, 8, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (219, 40, NULL, '채소만', 290, 33, 10, 13, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (220, 40, NULL, '두부볼 (아보카도)', 203, 12, 11, 12, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (221, 40, NULL, '비건 스리라차', 80, 10, 1, 4, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (222, 40, NULL, '와사비 참치 크런치 랩', 343, 43, 12, 14, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (223, 40, NULL, '구운버섯', 25, 4, 3, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (224, 40, NULL, '비건 크리미 어니언', 67, 10, 0, 3, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (225, 40, NULL, '두부볼(크랩미트)', 180, 13, 11, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (226, 40, NULL, '비건 현미밥 포케', 418, 62, 10, 16, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (227, 40, NULL, '양송이 스프', 338, 21, 6, 26, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (228, 40, NULL, '랍스터 두부볼', 176, 12, 12, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (229, 40, NULL, '비건 숯불 직화 미트', 172, 11, 11, 10, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (230, 40, NULL, '비건 채소만 포케', 264, 30, 7, 13, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (231, 40, NULL, '곡물밥 토핑', 183, 37, 5, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (232, 40, NULL, '미니 들기름 메밀면 샐러드', 254, 31, 7, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (233, 40, NULL, '두부볼 와사비참치', 171, 12, 14, 7, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (234, 40, NULL, '비건 메밀면 포케', 389, 56, 10, 14, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (235, 40, NULL, '현미밥 베이스', 403, 65, 12, 7, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (236, 40, NULL, '크리미어니언치킨랩', 325, 40, 16, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (237, 40, NULL, '숯불직화미트 메밀면 샐러드', 761, 85, 19, 39, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (238, 40, NULL, '두부버섯', 68, 5, 6, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (239, 40, NULL, '비건크리미어니언', 67, 10, 0, 3, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (240, 40, NULL, '고추냉이간장', 42, 8, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (241, 40, NULL, '쭈꾸미', 40, 0, 9, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (242, 40, NULL, '로제 파스타 연어 스테이크 포케', 499, 52, 29, 19, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (243, 40, NULL, '네오 쌈장', 112, 11, 2, 7, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (244, 40, NULL, '크랩미트 두부볼', 153, 13, 12, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (245, 40, NULL, '밸런스박스 닭다리살', 603, 62, 36, 23, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (246, 40, NULL, '구운로미연어 포케타코', 273, 32, 14, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (247, 40, NULL, '구운 오징어', 57, 0, 12, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (248, 40, NULL, '밸런스박스 소고기', 698, 57, 42, 34, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (249, 40, NULL, '오징어', 80, 0, 12, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (250, 40, NULL, '숯불미트(비건)', 165, 11, 11, 10, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (251, 40, NULL, '로제파스타 연어 스테이크', 499, 52, 29, 19, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (252, 40, NULL, '비건 곡물밥', 439, 64, 12, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (253, 40, NULL, '스윗올데이 레몬 그릭요거트', 291, 18, 18, 17, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (254, 40, NULL, '소불고기 메밀면 샐러드', 729, 81, 19, 37, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (255, 40, NULL, '두부볼 (콩고기)', 164, 14, 16, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (256, 40, NULL, '스무디볼(퍼플)', 565, 87, 7, 21, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (257, 40, NULL, '미트랩', 463, 20, 19, 29, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (258, 40, NULL, '스윗올데이 그릭요거트', 338, 9, 21, 24, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (259, 40, NULL, '닭가슴살 밸런스 박스', 536, 57, 45, 14, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (260, 40, NULL, '소고기 밸런스박스 도시락', 698, 57, 42, 34, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (261, 40, NULL, '프로틴 소프트 쿠키 초코 브라질넛', 166, 17, 11, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (262, 40, NULL, '비건참깨소스', 58, 4, 1, 4, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (263, 40, NULL, '더블토핑(연두부+고구마큐브)', 170, 20, 8, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (264, 43, NULL, '수비드 닭가슴살 포케', 525, 72, 35, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (265, 43, NULL, '부채살 스테이크 포케', 590, 67, 27, 24, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (266, 43, NULL, '훈제오리 포케', 665, 83, 22, 27, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (267, 43, NULL, '부채살 스테이크 샐러드', 330, 34, 22, 12, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (268, 43, NULL, '닭가슴살샌드위치', 490, 54, 21, 21, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (269, 43, NULL, '훈제오리 샐러드', 395, 24, 23, 23, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (270, 43, NULL, '양념소불고기포케', 525, 69, 22, 18, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (271, 43, NULL, '수비드 닭가슴살 샐러드', 285, 30, 28, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (272, 43, NULL, '오븐닭다리살 포케', 750, 69, 44, 33, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (273, 43, NULL, '매콤 오븐 닭다리살 샐러드', 435, 29, 33, 21, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (274, 43, NULL, '부채살 스테이크 도시락', 437, 45, 27, 14, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (275, 43, NULL, '유자 드레싱', 73, 18, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (276, 43, NULL, '매콤 오븐닭다리살 포케', 730, 76, 41, 29, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (277, 43, NULL, '씨푸드 포케', 445, 64, 20, 12, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (278, 43, NULL, '클래식 연어 샐러드', 290, 33, 15, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (279, 43, NULL, '클래식 연어 포케', 375, 50, 19, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (280, 43, NULL, '훈제오리 도시락', 441, 35, 28, 25, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (281, 43, NULL, '씨푸드 샐러드', 295, 40, 18, 7, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (282, 43, NULL, '수비드 닭가슴살 도시락', 334, 41, 33, 8, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (283, 43, NULL, '오리엔탈드레싱', 64, 16, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (284, 43, NULL, '할라피뇨 발사믹', 44, 7, 0, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (285, 43, NULL, '오븐닭다리살 샐러드', 535, 42, 33, 26, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (286, 43, NULL, '치즈불고기 샌드위치', 570, 49, 30, 28, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (287, 43, NULL, '수비드닭가슴살포케', 525, 72, 35, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (288, 43, NULL, '참치마요포케', 560, 72, 21, 21, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (289, 43, NULL, '비건 스테이크 포케', 530, 74, 20, 17, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (290, 43, NULL, '두부크럼블 머쉬룸 샐러드', 95, 12, 3, 4, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (291, 43, NULL, '모짜렐라 보코치니&파스타', 248, 24, 11, 12, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (292, 43, NULL, '두부크럼블머쉬룸포케', 530, 76, 18, 17, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (293, 43, NULL, '닭가슴살&메추리알 샐러드', 160, 2, 20, 8, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (294, 43, NULL, '양념소불고기 샐러드', 390, 27, 21, 22, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (295, 43, NULL, '불고기&오믈렛', 267, 27, 15, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (296, 43, NULL, '믹스너츠&리코타치즈', 365, 17, 11, 28, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (297, 43, NULL, '그라나파다노&닭가슴살', 138, 5, 16, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (298, 43, NULL, '자몽 리코타 샐러드', 360, 35, 10, 20, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (299, 43, NULL, '그라나파다노', 138, 5, 16, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (300, 43, NULL, '비건스테이크도시락', 361, 51, 22, 14, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (301, 43, NULL, '초계 두부면 샐러드', 211, 23, 23, 4, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (302, 43, NULL, '그라나파다노 닭가슴살 샐러드', 138, 5, 16, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (303, 44, NULL, '닭가슴살스테이크샐러드', 223, 10, 29, 5, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (304, 44, NULL, '치폴레 파스타 샐러드', 479, 53, 10, 21, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (305, 54, NULL, '우삼겹메밀면 샐러디', 302, 38, 19, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (306, 54, NULL, '탄단지 샐러디', 324, 34, 18, 14, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (307, 54, NULL, '우삼겹 웜볼', 428, 55, 20, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (308, 54, NULL, '단호박두부 샐러디', 225, 29, 7, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (309, 54, NULL, '크랜베리그릭랩', 538, 56, 11, 31, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (310, 54, NULL, '우삼겹 메밀면 샐러디', 301, 35, 19, 10, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (311, 54, NULL, '칠리베이컨 웜랩', 744, 84, 21, 36, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (312, 54, NULL, '치킨토마토샌드', 422, 39, 16, 22, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (313, 54, NULL, '콥 샐러디', 219, 14, 12, 13, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (314, 54, NULL, '멕시칸 랩', 613, 54, 20, 35, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (315, 54, NULL, '채소볼', 11, 1, 1, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (316, 54, NULL, '타코 쉬림프 샐러디', 185, 12, 13, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (317, 54, NULL, '노릇두부단호박 샐러디', 225, 29, 7, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (318, 54, NULL, '비빔메밀면 샐러디', 304, 34, 26, 7, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (319, 54, NULL, '로스트닭다리살 샐러디', 280, 33, 12, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (320, 54, NULL, '에그 토핑', 72, 1, 7, 4, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (321, 54, NULL, '시저치킨 샐러디', 109, 13, 14, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (322, 54, NULL, '치킨토마토 샌드', 520, 32, 21, 28, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (323, 54, NULL, '그라브락스 연어 샐러디', 242, 10, 21, 13, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (324, 54, NULL, '칠리베이컨 샐러디', 260, 20, 13, 14, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (325, 54, NULL, '곡물볼', 269, 47, 7, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (326, 54, NULL, '두부 토핑', 100, 8, 4, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (327, 54, NULL, '시저치킨 샐러드', 116, 15, 14, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (328, 54, NULL, '시저치킨랩', 482, 49, 19, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (329, 54, NULL, '맥시칸 랩', 594, 54, 18, 34, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (330, 54, NULL, '단호박두부샐러드', 264, 36, 7, 12, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (331, 54, NULL, '동원참치마요 샌드', 498, 30, 23, 24, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (332, 54, NULL, '단호박두부 웜볼', 390, 74, 15, 5, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (333, 54, NULL, '사워크림', 23, 1, 0, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (334, 54, NULL, '에그베이컨 샌드', 518, 30, 18, 29, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (335, 54, NULL, '양파플레이크', 55, 6, 0, 4, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (336, 54, NULL, '웜볼로 변경', 252, 43, 6, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (337, 54, NULL, '더블 우삼겹 야채죽', 174, 26, 7, 5, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (338, 54, NULL, '피키바초코베리', 200, 21, 15, 7, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (339, 54, NULL, '비빔우삼겹 윙볼', 445, 60, 19, 16, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (340, 54, NULL, '칠리베이컨 윙볼', 483, 57, 18, 20, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (341, 54, NULL, '로스트닭다리살 웜볼', 564, 97, 18, 13, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (342, 54, NULL, '머쉬룸두부 원볼', 457, 64, 14, 18, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (343, 54, NULL, '바질치킨 핫샌드위치', 558, 63, 29, 26, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (344, 54, NULL, '타바스코Ⓡ오리엔탈', 140, 12, 1, 10, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (345, 54, NULL, '더블 닭다리살 박스', 667, 83, 27, 24, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (346, 54, NULL, '더블 치킨 박스', 645, 74, 36, 23, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (347, 54, NULL, '우삼겹 원랩', 630, 70, 25, 29, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (348, 54, NULL, '바질치킨 랩', 526, 46, 24, 27, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (349, 54, NULL, '단호박 크림스프', 219, 21, 3, 14, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (350, 54, NULL, '시저', 240, 5, 1, 24, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (351, 54, NULL, '레몬', 175, 14, 0, 13, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (352, 54, NULL, '바베큐닭다리살 원랩', 595, 75, 21, 21, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (353, 54, NULL, '콘치즈 스프', 189, 21, 3, 10, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (354, 54, NULL, '그라운드비프', 108, 0, 10, 7, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (355, 54, NULL, '칠리베이컨웜랩', 706, 71, 23, 38, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (356, 54, NULL, '케일바나나', 119, 19, 3, 5, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (357, 54, NULL, '메밀면', 122, 22, 5, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (358, 54, NULL, '나쵸칩', 75, 9, 1, 4, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (359, 54, NULL, '할라피뇨치킨 웜볼', 409, 71, 25, 5, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (360, 54, NULL, '토마토', 8, 2, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (361, 54, NULL, '우삼겹 메밀면 샐러드', 302, 38, 19, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (362, 54, NULL, '머쉬룸', 59, 3, 2, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (363, 54, NULL, '시저드레싱', 240, 6, 1, 24, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (364, 54, NULL, '아메리카노', 23, 2, 2, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (365, 54, NULL, '에그마요', 123, 3, 5, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (366, 54, NULL, '에그토핑 (50g)', 68, 1, 7, 4, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (367, 54, NULL, '그린밀싹', 120, 28, 1, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (368, 54, NULL, '크랜베리', 31, 9, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (369, 54, NULL, '오렌지당근', 113, 27, 1, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (370, 54, NULL, '옥수수', 20, 4, 1, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (371, 54, NULL, '레드클렌즈', 120, 29, 1, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (372, 54, NULL, '양파', 9, 2, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (373, 54, NULL, '단호박두부웜볼', 390, 74, 15, 5, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (374, 54, NULL, '베이컨', 66, 1, 3, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (375, 54, NULL, '오렌지망고', 105, 23, 2, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (376, 54, NULL, '단호박 두부 웜볼', 390, 74, 15, 5, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (377, 54, NULL, '시저치킨 랩', 501, 50, 19, 26, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (378, 54, NULL, '더블 비프 박스', 763, 67, 34, 40, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (379, 54, NULL, '더블비프박스', 763, 67, 34, 40, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (380, 54, NULL, '두부 크럼블 토핑', 90, 1, 8, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (381, 54, NULL, '멕시칸갈빗살 포케랩', 749, 85, 21, 36, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (382, 54, NULL, '닭가슴살', 64, 2, 13, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (383, 54, NULL, '더블삼겹박스', 846, 68, 36, 49, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (384, 54, NULL, '로스트닭다리살 랩', 560, 48, 18, 33, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (385, 54, NULL, '더블 치킨 파스타 박스', 558, 45, 44, 21, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (386, 54, NULL, '로스트 닭다리살 토핑', 160, 7, 11, 8, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (387, 54, NULL, '고추장비빔', 80, 14, 1, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (388, 54, NULL, '포케볼', 271, 51, 8, 4, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (389, 54, NULL, '포테이토 크림스프', 210, 18, 7, 12, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (390, 54, NULL, '에그베이컨 버거', 518, 30, 18, 29, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (391, 54, NULL, '발사믹', 127, 15, 0, 8, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (392, 54, NULL, '할라피뇨치킨웜볼 채소볼로 변경', 183, 26, 18, 4, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (393, 54, NULL, '양송이 크림스프', 124, 9, 3, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (394, 54, NULL, '칠리베이컨 포케볼', 508, 64, 20, 19, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (395, 54, NULL, '티키타카 캐모마일피치', 0, 7, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (396, 54, NULL, '로스트닭다리살 샐러드', 268, 31, 13, 10, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (397, 54, NULL, '메밀면볼', 144, 26, 6, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (398, 54, NULL, '에다마메 토핑', 14, 1, 1, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (399, 54, NULL, '그라브락스 연어 포케볼', 464, 63, 23, 14, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (400, 54, NULL, '할라피뇨치킨 웜랩', 604, 48, 17, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (401, 54, NULL, '에그마요 랩', 671, 52, 20, 43, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (402, 54, NULL, '바질치킨브레드', 588, 63, 24, 24, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (403, 54, NULL, '치킨토마토버거', 520, 32, 21, 28, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (404, 54, NULL, '우삼겹메밀면', 307, 39, 19, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (405, 54, NULL, '오리엔탈', 160, 8, 1, 14, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (406, 54, NULL, '더블 우삼겹 박스', 593, 82, 28, 16, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (407, 54, NULL, '타바스코 오리엔탈 드레싱', 140, 12, 0, 10, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (408, 54, NULL, '치킨 토마토 스튜', 124, 13, 14, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (409, 54, NULL, '치킨곡물볼', 417, 48, 22, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (410, 54, NULL, '김햄찌아바타', 540, 54, 21, 27, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (411, 54, NULL, '더블닭다리살박스', 715, 87, 31, 26, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (412, 54, NULL, '비프에그마요 치아바타', 713, 65, 26, 39, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (413, 54, NULL, '정희원 픽 치킨 곡물볼', 417, 48, 22, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (414, 54, NULL, '더블 닭가슴살 누룽지죽', 184, 24, 12, 5, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (415, 54, NULL, '저당 레몬 허브 드레싱', 4, 8, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (416, 54, NULL, '비빔메밀면 누들볼', 236, 30, 13, 7, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (417, 54, NULL, '바베큐닭다리살 윙볼', 513, 59, 24, 18, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (418, 54, NULL, '치킨 치아바타', 469, 61, 17, 18, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (419, 54, NULL, '칠리베이컨웜볼', 435, 51, 20, 18, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (420, 54, NULL, '허니에그 라이트랩', 425, 44, 11, 22, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (421, 54, NULL, '크리미칠리 드레싱', 238, 14, 0, 20, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (422, 54, NULL, '동원참치마요 원볼', 558, 61, 26, 24, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (423, 54, NULL, '에그스크램블 토핑', 92, 4, 3, 7, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (424, 54, NULL, '칠리베이컨 윙랩', 745, 77, 22, 39, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (425, 54, NULL, '우삼겹 윙볼', 428, 55, 20, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (426, 54, NULL, '칠리베이컨 웜볼', 485, 66, 20, 16, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (427, 54, NULL, '에그마요 샌드', 548, 24, 16, 36, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (428, 54, NULL, '스윗포테이토', 126, 18, 1, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (429, 54, NULL, '바베큐닭다리살 샌드', 415, 29, 15, 17, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (430, 54, NULL, '크리미할라피뇨', 235, 7, 1, 23, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (431, 54, NULL, '새해복러디', 566, 53, 17, 31, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (432, 54, NULL, '치킨토마토 스튜', 124, 13, 14, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (433, 54, NULL, '로스트닭다리살', 120, 6, 9, 7, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (434, 54, NULL, '크리미칠리', 235, 14, 0, 20, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (435, 54, NULL, '바베큐삼겹 덮밥', 841, 101, 26, 37, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (436, 54, NULL, '우삼겹', 61, 3, 10, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (437, 54, NULL, '오리엔탈 드레싱', 160, 8, 1, 14, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (438, 54, NULL, '로스트닭다리살 브레드', 484, 63, 24, 24, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (439, 54, NULL, '그라브락스 연어', 99, 1, 13, 5, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (440, 54, NULL, '저당 참깨소이소스', 96, 7, 1, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (441, 54, NULL, '할라피뇨', 7, 1, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (442, 54, NULL, '바질파스타볼', 209, 25, 7, 8, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (443, 54, NULL, '참치믹스', 120, 2, 11, 8, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (444, 54, NULL, '곡물 추가', 112, 23, 4, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (445, 54, NULL, '바베큐닭다리살 포케랩', 626, 92, 24, 18, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (446, 54, NULL, '올리브', 32, 2, 0, 3, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (447, 54, NULL, '우삼겹포케', 500, 50, 30, 20, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (448, 54, NULL, '단호박', 59, 13, 1, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (449, 54, NULL, '오이', 3, 1, 0, 0, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (450, 54, NULL, '바질페스토', 119, 1, 3, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (451, 54, NULL, '당근라페', 26, 3, 0, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (452, 54, NULL, '견과류', 89, 3, 3, 8, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (453, 54, NULL, '고추장 비빔 드레싱', 80, 17, 1, 1, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (454, 54, NULL, '더블치킨파스타박스', 602, 50, 45, 23, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (455, 54, NULL, '갈빗살메밀면 누들볼', 494, 40, 26, 27, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (456, 54, NULL, '우삼겹 포케볼', 631, 69, 22, 30, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (457, 54, NULL, '타코 쉬림프 샐러드', 185, 12, 13, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (458, 54, NULL, '타코 쉬림프 랩 샌드위치', 523, 67, 13, 22, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (459, 54, NULL, '우삼겹 메밀면 누들볼', 413, 38, 18, 21, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (460, 54, NULL, '그라브릭스 연어 포케볼', 464, 63, 23, 14, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (461, 54, NULL, '바베큐 닭다리살 포케볼', 570, 73, 28, 18, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (462, 54, NULL, '우삼겹 포케랩', 692, 76, 25, 35, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (463, 54, NULL, '노릇노릇두부 포케볼', 507, 70, 17, 19, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (464, 54, NULL, '로스트삼겹포케볼', 606, 68, 21, 29, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (465, 54, NULL, '우삼겹메밀면 샐러드', 302, 38, 19, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (466, 54, NULL, '그라브락스 연어 파스타 누들볼', 336, 30, 20, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (467, 54, NULL, '에그마요 토핑', 110, 2, 4, 10, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (468, 54, NULL, '크런치비프 라이트랩', 461, 44, 15, 25, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (469, 54, NULL, '바베큐닭다리살 곡물랩', 717, 77, 26, 34, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (470, 54, NULL, '스파이시치킨 라이트랩', 336, 51, 13, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (471, 54, NULL, '(저당) 발사믹 드레싱', 110, 14, 0, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (472, 54, NULL, '튜나 치아바타', 625, 60, 29, 29, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (473, 54, NULL, '고소삼겹 들기름파스타 누들볼', 445, 43, 16, 24, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (474, 54, NULL, '바질연어 치아바타', 608, 71, 25, 24, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (475, 54, NULL, '더블닭가슴살박스', 653, 75, 38, 23, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (476, 54, NULL, '우삼겹메밀면 누들볼', 407, 36, 18, 21, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (477, 54, NULL, '노릇두부 스프카레', 182, 23, 7, 8, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (478, 54, NULL, '잠봉 슬라이스', 44, 1, 6, 2, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (479, 54, NULL, '그라브락스 연어 랩', 438, 45, 18, 21, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (480, 54, NULL, '오코노미야끼st 곡물볼', 836, 69, 27, 51, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (481, 54, NULL, '그라브락스 연어 파스타 샐러드', 336, 30, 20, 15, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (482, 54, NULL, '그라브락스 연어 토핑', 99, 1, 13, 5, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (483, 54, NULL, '치킨MAX프로틴파스타', 708, 66, 52, 24, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (484, 54, NULL, '파스타볼', 158, 28, 5, 3, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (485, 54, NULL, '클래식치킨샌드위치', 469, 61, 17, 18, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (486, 54, NULL, '카사바칩', 245, 36, 2, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (487, 54, NULL, 'BELT 시저 샌드위치', 570, 53, 22, 30, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (488, 54, NULL, '잠봉샌드위치', 500, 54, 21, 22, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (489, 54, NULL, '우삼겹 MAX 프로틴 박스', 901, 88, 39, 44, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (490, 54, NULL, '(저당) 닭다리살 MAX 프로틴 박스', 759, 97, 43, 22, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (491, 1, NULL, '이삭토스트 새우치즈 고로케', 560, 66, 15, 26, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (492, 10, NULL, '햄치즈에그 킹토스트', 505, 66, 19, 18, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (493, 43, NULL, '치킨랩샌드&샐러드박스', 264, 41, 5, 9, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (494, 43, NULL, '닭가슴살 샐러드박스', 340, 31, 27, 12, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (495, 43, NULL, '치킨텐더 샐러드박스', 393, 40, 18, 18, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (496, 43, NULL, '불고기계란 샐러드박스', 447, 45, 25, 18, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (497, 43, NULL, '로스트비프 샐러드박스', 180, 19, 13, 6, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (498, 43, NULL, '아삭아삭 치킨샌드&샐러드박스', 524, 65, 15, 20, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (499, 43, NULL, '판다의 에그포테이토 샐러드박스', 310, 40, 13, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (500, 43, NULL, '판다의 바베큐치킨랩 샐러드박스', 332, 44, 14, 11, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (501, 43, NULL, '판다의 불고기랩 샐러드박스', 374, 61, 10, 10, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (502, 43, NULL, '판다의 바질치킨랩 샐러드박스', 333, 40, 15, 13, NULL, NULL, false);
INSERT INTO tdj.menus (menu_id, brand_id, store_id, menu_name, kcal, carbs, protein, fat, sugar, menu_url, is_standard) VALUES (503, 43, NULL, '든든 불고기 곡물 샐러드박스', 195, 22, 17, 4, NULL, NULL, false);


--
-- Data for Name: users; Type: TABLE DATA; Schema: tdj; Owner: test0320
--



--
-- Data for Name: diet_logs; Type: TABLE DATA; Schema: tdj; Owner: test0320
--



--
-- Data for Name: exercise_types; Type: TABLE DATA; Schema: tdj; Owner: test0320
--



--
-- Data for Name: exercise_logs; Type: TABLE DATA; Schema: tdj; Owner: test0320
--



--
-- Data for Name: posts; Type: TABLE DATA; Schema: tdj; Owner: test0320
--



--
-- Data for Name: reports; Type: TABLE DATA; Schema: tdj; Owner: test0320
--



--
-- Data for Name: reviews; Type: TABLE DATA; Schema: tdj; Owner: test0320
--



--
-- Data for Name: social_logins; Type: TABLE DATA; Schema: tdj; Owner: test0320
--



--
-- Name: brands_brand_id_seq; Type: SEQUENCE SET; Schema: tdj; Owner: test0320
--

SELECT pg_catalog.setval('tdj.brands_brand_id_seq', 64, true);


--
-- Name: diet_logs_log_id_seq; Type: SEQUENCE SET; Schema: tdj; Owner: test0320
--

SELECT pg_catalog.setval('tdj.diet_logs_log_id_seq', 1, false);


--
-- Name: exercise_logs_exercise_id_seq; Type: SEQUENCE SET; Schema: tdj; Owner: test0320
--

SELECT pg_catalog.setval('tdj.exercise_logs_exercise_id_seq', 1, false);


--
-- Name: exercise_types_type_id_seq; Type: SEQUENCE SET; Schema: tdj; Owner: test0320
--

SELECT pg_catalog.setval('tdj.exercise_types_type_id_seq', 1, false);


--
-- Name: menus_menu_id_seq; Type: SEQUENCE SET; Schema: tdj; Owner: test0320
--

SELECT pg_catalog.setval('tdj.menus_menu_id_seq', 503, true);


--
-- Name: posts_post_id_seq; Type: SEQUENCE SET; Schema: tdj; Owner: test0320
--

SELECT pg_catalog.setval('tdj.posts_post_id_seq', 1, false);


--
-- Name: reports_report_id_seq; Type: SEQUENCE SET; Schema: tdj; Owner: test0320
--

SELECT pg_catalog.setval('tdj.reports_report_id_seq', 1, false);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: tdj; Owner: test0320
--

SELECT pg_catalog.setval('tdj.reviews_review_id_seq', 1, false);


--
-- Name: social_logins_social_id_seq; Type: SEQUENCE SET; Schema: tdj; Owner: test0320
--

SELECT pg_catalog.setval('tdj.social_logins_social_id_seq', 1, false);


--
-- Name: stores_store_id_seq; Type: SEQUENCE SET; Schema: tdj; Owner: test0320
--

SELECT pg_catalog.setval('tdj.stores_store_id_seq', 174, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: tdj; Owner: test0320
--

SELECT pg_catalog.setval('tdj.users_user_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

\unrestrict PYt4mrphnfPfVs1MJi0FBlHdtlWWu1EiJNfoHOaTmH3KA3jFGCYCPyf9X4OHgfF

