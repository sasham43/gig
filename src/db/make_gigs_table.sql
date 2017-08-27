CREATE TABLE "public"."gigs" (
    "id" serial,
    "name" text,
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "date_added" timestamp with time zone DEFAULT now(),
    "location" int,
    "owner_id" int,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("location") REFERENCES "public"."locations"("id"),
    FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id")
);
