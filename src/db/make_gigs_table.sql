CREATE TABLE "public"."gigs" (
    "id" serial,
    "name" text,
    "start_date" date,
    "end_date" date,
    "start_time" time with time zone,
    "end_time" time with time zone,
    "date_added" timestamp with time zone DEFAULT now(),
    "description" text,
    "location_id" int,
    "owner_id" int,
    "published" boolean,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("location") REFERENCES "public"."locations"("id"),
    FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id")
);
