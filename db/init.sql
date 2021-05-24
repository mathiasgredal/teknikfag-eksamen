CREATE USER postgres WITH PASSWORD 'postgres';
CREATE DATABASE webshop;
GRANT ALL PRIVILEGES ON DATABASE postgres TO postgres;

CREATE OR REPLACE FUNCTION random_between(low BIGINT ,high BIGINT) 
   RETURNS BIGINT AS
$$
BEGIN
   RETURN floor(random()* (high-low + 1) + low);
END;
$$ language 'plpgsql' STRICT;

-- Create tables
CREATE TABLE IF NOT EXISTS "products"(
    "id" BIGINT GENERATED ALWAYS AS IDENTITY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL CHECK (stock >= 0),
    "category" INTEGER,
    "image" TEXT,
    "created" DATE NOT NULL,
    "last_updated" DATE NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS "categories"(
    "id" BIGINT GENERATED ALWAYS AS IDENTITY,
    "name" TEXT NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS "users"(
    "id" BIGINT DEFAULT random_between(1, 999999999999999999),
    "username" TEXT NOT NULL UNIQUE,
    "birthday" DATE,
    "country" INTEGER,
    "registered" TIMESTAMPTZ NOT NULL,
    "password" TEXT NOT NULL,
    "profile_picture" TEXT,
    "isadmin" boolean,
    PRIMARY KEY (id)
);
COMMENT ON COLUMN
    "users"."password" IS 'bcrypt password hash';

CREATE TABLE IF NOT EXISTS "reviews"(
    "id" INT GENERATED ALWAYS AS IDENTITY,
    "stars" INTEGER NOT NULL CHECK (stars > 0) CHECK (stars <= 5),
    "review" TEXT NOT NULL,
    "author" BIGINT NOT NULL REFERENCES users(id),
    "created" DATE NOT NULL,
    "product" INTEGER NOT NULL,
    "last_updated" DATE NOT NULL,
    PRIMARY KEY (id)
);

-- Create relations
ALTER TABLE IF EXISTS
    "products" ADD CONSTRAINT "fk_category" FOREIGN KEY("category") REFERENCES "categories"("id");
ALTER TABLE IF EXISTS
    "reviews" ADD CONSTRAINT "fk_product" FOREIGN KEY("product") REFERENCES "products"("id");
ALTER TABLE IF EXISTS
    "users" ADD CONSTRAINT "fk_country" FOREIGN KEY("country") REFERENCES "countries"("id");

DROP TABLE IF EXISTS "countries";
CREATE TABLE "countries"(
    "id" INT GENERATED ALWAYS AS IDENTITY,
    "country_code" TEXT NOT NULL,
    "country_name" TEXT NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO "countries" ("country_code", "country_name") VALUES (E'AF', E'Afghanistan') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'AX', E'Åland Islands') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'AL', E'Albania') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'DZ', E'Algeria') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'AS', E'American Samoa') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'AD', E'Andorra') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'AO', E'Angola') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'AI', E'Anguilla') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'AQ', E'Antarctica') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'AG', E'Antigua & Barbuda') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'AR', E'Argentina') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'AM', E'Armenia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'AW', E'Aruba') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'AU', E'Australia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'AT', E'Austria') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'AZ', E'Azerbaijan') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BS', E'Bahamas') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BH', E'Bahrain') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BD', E'Bangladesh') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BB', E'Barbados') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BY', E'Belarus') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BE', E'Belgium') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BZ', E'Belize') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BJ', E'Benin') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BM', E'Bermuda') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BT', E'Bhutan') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BO', E'Bolivia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BA', E'Bosnia & Herzegovina') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BW', E'Botswana') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BV', E'Bouvet Island') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BR', E'Brazil') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'IO', E'British Indian Ocean Territory') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'VG', E'British Virgin Islands') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BN', E'Brunei') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BG', E'Bulgaria') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BF', E'Burkina Faso') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BI', E'Burundi') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'KH', E'Cambodia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'CM', E'Cameroon') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'CA', E'Canada') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'CV', E'Cape Verde') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BQ', E'Caribbean Netherlands') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'KY', E'Cayman Islands') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'CF', E'Central African Republic') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'TD', E'Chad') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'CL', E'Chile') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'CN', E'China') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'CX', E'Christmas Island') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'CC', E'Cocos (Keeling) Islands') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'CO', E'Colombia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'KM', E'Comoros') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'CG', E'Congo - Brazzaville') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'CD', E'Congo - Kinshasa') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'CK', E'Cook Islands') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'CR', E'Costa Rica') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'CI', E'Côte d’Ivoire') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'HR', E'Croatia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'CU', E'Cuba') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'CW', E'Curaçao') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'CY', E'Cyprus') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'CZ', E'Czechia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'DK', E'Denmark') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'DJ', E'Djibouti') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'DM', E'Dominica') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'DO', E'Dominican Republic') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'EC', E'Ecuador') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'EG', E'Egypt') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SV', E'El Salvador') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'GQ', E'Equatorial Guinea') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'ER', E'Eritrea') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'EE', E'Estonia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SZ', E'Eswatini') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'ET', E'Ethiopia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'FK', E'Falkland Islands') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'FO', E'Faroe Islands') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'FJ', E'Fiji') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'FI', E'Finland') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'FR', E'France') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'GF', E'French Guiana') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'PF', E'French Polynesia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'TF', E'French Southern Territories') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'GA', E'Gabon') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'GM', E'Gambia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'GE', E'Georgia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'DE', E'Germany') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'GH', E'Ghana') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'GI', E'Gibraltar') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'GR', E'Greece') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'GL', E'Greenland') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'GD', E'Grenada') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'GP', E'Guadeloupe') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'GU', E'Guam') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'GT', E'Guatemala') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'GG', E'Guernsey') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'GN', E'Guinea') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'GW', E'Guinea-Bissau') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'GY', E'Guyana') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'HT', E'Haiti') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'HM', E'Heard & McDonald Islands') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'HN', E'Honduras') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'HK', E'Hong Kong SAR China') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'HU', E'Hungary') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'IS', E'Iceland') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'IN', E'India') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'ID', E'Indonesia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'IR', E'Iran') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'IQ', E'Iraq') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'IE', E'Ireland') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'IM', E'Isle of Man') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'IL', E'Israel') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'IT', E'Italy') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'JM', E'Jamaica') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'JP', E'Japan') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'JE', E'Jersey') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'JO', E'Jordan') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'KZ', E'Kazakhstan') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'KE', E'Kenya') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'KI', E'Kiribati') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'KW', E'Kuwait') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'KG', E'Kyrgyzstan') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'LA', E'Laos') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'LV', E'Latvia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'LB', E'Lebanon') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'LS', E'Lesotho') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'LR', E'Liberia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'LY', E'Libya') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'LI', E'Liechtenstein') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'LT', E'Lithuania') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'LU', E'Luxembourg') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MO', E'Macao SAR China') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MG', E'Madagascar') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MW', E'Malawi') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MY', E'Malaysia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MV', E'Maldives') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'ML', E'Mali') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MT', E'Malta') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MH', E'Marshall Islands') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MQ', E'Martinique') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MR', E'Mauritania') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MU', E'Mauritius') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'YT', E'Mayotte') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MX', E'Mexico') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'FM', E'Micronesia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MD', E'Moldova') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MC', E'Monaco') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MN', E'Mongolia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'ME', E'Montenegro') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MS', E'Montserrat') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MA', E'Morocco') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MZ', E'Mozambique') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MM', E'Myanmar (Burma)') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'NA', E'Namibia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'NR', E'Nauru') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'NP', E'Nepal') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'NL', E'Netherlands') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'NC', E'New Caledonia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'NZ', E'New Zealand') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'NI', E'Nicaragua') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'NE', E'Niger') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'NG', E'Nigeria') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'NU', E'Niue') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'NF', E'Norfolk Island') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'KP', E'North Korea') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MK', E'North Macedonia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MP', E'Northern Mariana Islands') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'NO', E'Norway') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'OM', E'Oman') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'PK', E'Pakistan') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'PW', E'Palau') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'PS', E'Palestinian Territories') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'PA', E'Panama') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'PG', E'Papua New Guinea') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'PY', E'Paraguay') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'PE', E'Peru') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'PH', E'Philippines') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'PN', E'Pitcairn Islands') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'PL', E'Poland') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'PT', E'Portugal') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'PR', E'Puerto Rico') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'QA', E'Qatar') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'RE', E'Réunion') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'RO', E'Romania') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'RU', E'Russia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'RW', E'Rwanda') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'WS', E'Samoa') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SM', E'San Marino') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'ST', E'São Tomé & Príncipe') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SA', E'Saudi Arabia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SN', E'Senegal') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'RS', E'Serbia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SC', E'Seychelles') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SL', E'Sierra Leone') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SG', E'Singapore') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SX', E'Sint Maarten') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SK', E'Slovakia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SI', E'Slovenia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SB', E'Solomon Islands') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SO', E'Somalia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'ZA', E'South Africa') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'GS', E'South Georgia & South Sandwich Islands') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'KR', E'South Korea') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SS', E'South Sudan') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'ES', E'Spain') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'LK', E'Sri Lanka') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'BL', E'St. Barthélemy') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SH', E'St. Helena') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'KN', E'St. Kitts & Nevis') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'LC', E'St. Lucia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'MF', E'St. Martin') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'PM', E'St. Pierre & Miquelon') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'VC', E'St. Vincent & Grenadines') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SD', E'Sudan') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SR', E'Suriname') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SJ', E'Svalbard & Jan Mayen') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SE', E'Sweden') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'CH', E'Switzerland') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'SY', E'Syria') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'TW', E'Taiwan') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'TJ', E'Tajikistan') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'TZ', E'Tanzania') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'TH', E'Thailand') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'TL', E'Timor-Leste') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'TG', E'Togo') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'TK', E'Tokelau') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'TO', E'Tonga') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'TT', E'Trinidad & Tobago') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'TN', E'Tunisia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'TR', E'Turkey') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'TM', E'Turkmenistan') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'TC', E'Turks & Caicos Islands') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'TV', E'Tuvalu') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'UM', E'U.S. Outlying Islands') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'VI', E'U.S. Virgin Islands') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'UG', E'Uganda') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'UA', E'Ukraine') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'AE', E'United Arab Emirates') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'GB', E'United Kingdom') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'US', E'United States') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'UY', E'Uruguay') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'UZ', E'Uzbekistan') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'VU', E'Vanuatu') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'VA', E'Vatican City') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'VE', E'Venezuela') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'VN', E'Vietnam') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'WF', E'Wallis & Futuna') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'EH', E'Western Sahara') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'YE', E'Yemen') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'ZM', E'Zambia') ON CONFLICT (id) DO NOTHING;
INSERT INTO "countries" ("country_code", "country_name") VALUES (E'ZW', E'Zimbabwe') ON CONFLICT (id) DO NOTHING;