CREATE TABLE "public"."locations" (
    "id" serial,
    "name" text,
    "date_added" timestamp with time zone DEFAULT now(),
    "street" text,
    "city" text,
    "state" text,
    "zip" int,
    "lat" float,
    "lon" float,
    "image" text,
    "owner_id" int,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id")
);

ALTER TABLE "public"."locations"
  ADD COLUMN "owner_id" int,
  ADD FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id");
