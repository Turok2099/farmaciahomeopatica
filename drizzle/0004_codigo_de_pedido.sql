ALTER TABLE "orders" ADD COLUMN "order_number" text;--> statement-breakpoint
-- Pedidos que ya existieran (no debería haber ninguno en producción): reciben un código aleatorio.
UPDATE "orders" SET "order_number" = 'SCH-' || upper(substr(md5(random()::text || "id"::text), 1, 6)) WHERE "order_number" IS NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "order_number" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_order_number_unique" UNIQUE("order_number");
