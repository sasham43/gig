CREATE TABLE "public"."users" (
    "id" serial,
    "first_name" text,
    "last_name" text,
    "google_image" text,
    "date_added" timestamp with time zone DEFAULT now(),
    "google_id" text,
    PRIMARY KEY ("id")
);
