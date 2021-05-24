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
