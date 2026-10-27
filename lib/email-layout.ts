import { ADDRESS, SITE_NAME, SITE_URL, SOCIAL_PROFILES } from "@/lib/site";
import { HOURS_LINES } from "@/lib/store-hours";

// Plantilla común de los correos al cliente: todos llevan el logo en el encabezado y el mismo pie.
// Está hecha con tablas y estilos en línea porque los clientes de correo (Outlook, Gmail) ignoran casi todo el CSS moderno.

export const CONTACT_EMAIL = "contacto@schussler.com.mx";

const COLORS = {
    brand: "#014c80", // mismo azul del logo: la franja del encabezado se funde con la imagen
    text: "#172b3a",
    muted: "#5b6b78",
    border: "#dde3ea",
    page: "#f5f7fa",
    card: "#ffffff",
};

// El logo debe ser una URL pública y absoluta: el correo se abre fuera de nuestro sitio. PNG, no WebP, por compatibilidad.
const LOGO_URL = `${SITE_URL}/brand/logo-small.png`;

// Los datos del cliente se insertan en HTML: se escapan siempre.
export const esc = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export const emailStyles = {
    h1: `margin:0 0 16px;font-size:24px;line-height:1.3;color:${COLORS.text};font-weight:700`,
    p: `margin:0 0 16px;font-size:16px;line-height:1.55;color:${COLORS.text}`,
    small: `margin:0 0 12px;font-size:13px;line-height:1.5;color:${COLORS.muted}`,
    box: `background:${COLORS.page};border:1px solid ${COLORS.border};border-radius:8px;padding:16px;margin:0 0 20px`,
    colors: COLORS,
};

export function emailButton(url: string, label: string) {
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 24px"><tr>
<td bgcolor="${COLORS.brand}" style="border-radius:6px"><a href="${url}" style="display:inline-block;padding:12px 28px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px">${label}</a></td>
</tr></table>`;
}

interface LayoutOptions {
    // Texto que muestra la bandeja de entrada junto al asunto.
    preheader: string;
    // Contenido del correo (HTML ya escapado).
    body: string;
}

export function emailLayout({ preheader, body }: LayoutOptions) {
    const hours = HOURS_LINES.map((l) => `${esc(l.days)}: ${esc(l.hours)}`).join("<br>");
    const social = SOCIAL_PROFILES.map((url) => {
        const name = url.includes("instagram") ? "Instagram" : "Facebook";
        return `<a href="${url}" style="color:${COLORS.brand};text-decoration:underline">${name}</a>`;
    }).join(" &nbsp;·&nbsp; ");

    return `<!DOCTYPE html>
<html lang="es-MX">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(SITE_NAME)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.page};font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${COLORS.page}">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLORS.page}">
<tr><td align="center" style="padding:24px 12px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px">
    <tr><td align="center" bgcolor="${COLORS.brand}" style="background:${COLORS.brand};border-radius:10px 10px 0 0;padding:20px 24px">
      <a href="${SITE_URL}" style="text-decoration:none"><img src="${LOGO_URL}" width="280" alt="${esc(SITE_NAME)}" style="display:block;border:0;width:280px;max-width:100%;height:auto;color:#ffffff;font-size:20px;font-weight:700"></a>
    </td></tr>
    <tr><td bgcolor="${COLORS.card}" style="background:${COLORS.card};padding:32px 28px;border-left:1px solid ${COLORS.border};border-right:1px solid ${COLORS.border}">
      ${body}
    </td></tr>
    <tr><td bgcolor="${COLORS.card}" style="background:${COLORS.card};border:1px solid ${COLORS.border};border-top:3px solid ${COLORS.brand};border-radius:0 0 10px 10px;padding:20px 28px">
      <p style="margin:0 0 6px;font-size:13px;line-height:1.5;color:${COLORS.text}"><strong>${esc(SITE_NAME)}</strong><br>${esc(ADDRESS.streetAddress)}, ${esc(ADDRESS.addressLocality)}, CP ${esc(ADDRESS.postalCode)}</p>
      <p style="margin:0 0 10px;font-size:13px;line-height:1.5;color:${COLORS.muted}">${hours}</p>
      <p style="margin:0 0 10px;font-size:13px;line-height:1.5;color:${COLORS.muted}">¿Dudas? Responde a este correo o escríbenos a <a href="mailto:${CONTACT_EMAIL}" style="color:${COLORS.brand}">${CONTACT_EMAIL}</a>.</p>
      <p style="margin:0;font-size:13px;line-height:1.5;color:${COLORS.muted}"><a href="${SITE_URL}" style="color:${COLORS.brand};text-decoration:underline">${SITE_URL.replace(/^https?:\/\//, "")}</a> &nbsp;·&nbsp; ${social}</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}
