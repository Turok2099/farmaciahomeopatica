import { sql } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, boolean, integer, uniqueIndex } from 'drizzle-orm/pg-core';

export const userRoles = ['admin', 'staff', 'customer'] as const;
export type UserRole = (typeof userRoles)[number];

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    // admin: único (índice parcial); staff: solo activa/desactiva productos; customer: cliente.
    role: text('role').$type<UserRole>().notNull().default('customer'),
    createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
    uniqueIndex('users_single_admin').on(table.role).where(sql`${table.role} = 'admin'`),
]);

export const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(),
});

export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description').notNull().default(''),
    // Ej. "250 ml", "60 g", "30 pastillas".
    presentation: text('presentation').notNull().default(''),
    // Precio de venta en centavos de MXN.
    priceCents: integer('price_cents').notNull(),
    categoryId: integer('category_id').notNull().references(() => categories.id),
    // public_id de Cloudinary (sin extensión ni versión); vacío si aún no hay foto.
    imageId: text('image_id').notNull().default(''),
    // Interruptor de disponibilidad: apagado = "Agotado" y no se puede comprar.
    available: boolean('available').notNull().default(true),
    // Solo el administrador: oculta el producto de la tienda.
    published: boolean('published').notNull().default(true),
    featured: boolean('featured').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const orderStatuses = ['pending', 'paid', 'delivered', 'cancelled'] as const;
export type OrderStatus = (typeof orderStatuses)[number];
export type Fulfillment = 'delivery' | 'pickup';

export const orders = pgTable('orders', {
    id: serial('id').primaryKey(),
    // Token no adivinable: sirve para que el cliente (incluso sin cuenta) vea su pedido.
    publicId: text('public_id').notNull().unique(),
    // Código que ve el cliente (p. ej. SCH-7K4M9Q). No es consecutivo; el id serial queda como llave interna.
    orderNumber: text('order_number').notNull().unique(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
    // pending: esperando pago · paid: pagado, por entregar · delivered: entregado/recogido · cancelled
    status: text('status').$type<OrderStatus>().notNull().default('pending'),
    fulfillment: text('fulfillment').$type<Fulfillment>().notNull(),
    customerName: text('customer_name').notNull(),
    customerEmail: text('customer_email').notNull(),
    customerPhone: text('customer_phone').notNull(),
    addressStreet: text('address_street').notNull().default(''),
    addressNeighborhood: text('address_neighborhood').notNull().default(''),
    addressPostalCode: text('address_postal_code').notNull().default(''),
    addressNotes: text('address_notes').notNull().default(''),
    subtotalCents: integer('subtotal_cents').notNull(),
    shippingCents: integer('shipping_cents').notNull().default(0),
    totalCents: integer('total_cents').notNull(),
    stripeSessionId: text('stripe_session_id').unique(),
    stripePaymentIntentId: text('stripe_payment_intent_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    paidAt: timestamp('paid_at'),
    // Se marca al enviar el correo de confirmación; null = pendiente de enviar (o de reintentar).
    confirmationSentAt: timestamp('confirmation_sent_at'),
});

export const orderItems = pgTable('order_items', {
    id: serial('id').primaryKey(),
    orderId: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
    // Copia del producto al momento de la compra: no cambia si luego editas el catálogo.
    productId: integer('product_id'),
    name: text('name').notNull(),
    unitPriceCents: integer('unit_price_cents').notNull(),
    quantity: integer('quantity').notNull(),
});

// Solo se guarda el hash (SHA-256) del token: si se filtra la base, los enlaces no sirven.
export const passwordResetTokens = pgTable('password_reset_tokens', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Contadores para limitar intentos (login, registro, recuperación). Ver lib/rate-limit.ts.
export const rateLimits = pgTable('rate_limits', {
    key: text('key').primaryKey(),
    count: integer('count').notNull(),
    resetAt: timestamp('reset_at').notNull(),
});
