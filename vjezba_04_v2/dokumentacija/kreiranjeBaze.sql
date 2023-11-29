-- Creator:       MySQL Workbench 8.0.34/ExportSQLite Plugin 0.1.0
-- Author:        budal
-- Caption:       New Model
-- Project:       Name of the project
-- Changed:       2023-10-22 21:34
-- Created:       2023-10-22 18:50
PRAGMA foreign_keys = OFF;

-- Schema: mydb
BEGIN;
CREATE TABLE "tip_korisnik"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "naziv" VARCHAR(45) NOT NULL,
  "opis" TEXT
);
CREATE TABLE "serija"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "naziv" VARCHAR(45) NOT NULL,
  "opis" TEXT,
  "broj_sezona" INTEGER,
  "broj_epizoda" INTEGER,
  "popularnost" FLOAT,
  "putanja_slike" VARCHAR(255),
  "URL" VARCHAR(255)
);
CREATE TABLE "sezona"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "naziv" VARCHAR(100) NOT NULL,
  "opis" TEXT,
  "putanja_slike" VARCHAR(255),
  "broj_sezone" INTEGER NOT NULL,
  "broj_epizoda" INTEGER NOT NULL,
  "sezonacol" VARCHAR(45),
  "serija_idSerija" INTEGER NOT NULL,
  CONSTRAINT "fk_sezona_serija1"
    FOREIGN KEY("serija_idSerija")
    REFERENCES "serija"("id")
);
CREATE INDEX "sezona.fk_sezona_serija1_idx" ON "sezona" ("serija_idSerija");
CREATE TABLE "korisnik"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "ime" VARCHAR(45),
  "prezime" VARCHAR(50),
  "adresa" TEXT,
  "korime" VARCHAR(50) NOT NULL,
  "lozinka" VARCHAR(45) NOT NULL,
  "email" VARCHAR(45) NOT NULL,
  "drzava" VARCHAR(100),
  "dob" INTEGER,
  "tip_korisnik_idTip" INTEGER NOT NULL,
  CONSTRAINT "korime_UNIQUE"
    UNIQUE("korime"),
  CONSTRAINT "email_UNIQUE"
    UNIQUE("email"),
  CONSTRAINT "fk_korisnik_tip_korisnik"
    FOREIGN KEY("tip_korisnik_idTip")
    REFERENCES "tip_korisnik"("id")
);
CREATE INDEX "korisnik.fk_korisnik_tip_korisnik_idx" ON "korisnik" ("tip_korisnik_idTip");
CREATE TABLE "favorit"(
  "serija_idSerija" INTEGER NOT NULL,
  "korisnik_idKorisnik" INTEGER NOT NULL,
  PRIMARY KEY("serija_idSerija","korisnik_idKorisnik"),
  CONSTRAINT "fk_favorit_serija1"
    FOREIGN KEY("serija_idSerija")
    REFERENCES "serija"("id"),
  CONSTRAINT "fk_favorit_korisnik1"
    FOREIGN KEY("korisnik_idKorisnik")
    REFERENCES "korisnik"("id")
);
CREATE INDEX "favorit.fk_favorit_serija1_idx" ON "favorit" ("serija_idSerija");
CREATE INDEX "favorit.fk_favorit_korisnik1_idx" ON "favorit" ("korisnik_idKorisnik");
CREATE TABLE "dnevnik"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "datum" DATE,
  "vrijeme" TIME,
  "metoda" VARCHAR(45) NOT NULL,
  "opis" TEXT,
  "korisnik_idKorisnik" INTEGER NOT NULL,
  CONSTRAINT "fk_dnevnik_korisnik1"
    FOREIGN KEY("korisnik_idKorisnik")
    REFERENCES "korisnik"("id")
);
CREATE INDEX "dnevnik.fk_dnevnik_korisnik1_idx" ON "dnevnik" ("korisnik_idKorisnik");
COMMIT;

INSERT INTO "tip_korisnik" ("id", "naziv", "opis") VALUES 
(1, 'Administrator', 'Administrator'),
(2, 'Registriran korisnik', 'Registrirani korisnik');