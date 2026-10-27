import { Resend } from "resend";

let client: Resend | undefined;

function resend() {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("Falta RESEND_API_KEY.");
    client ??= new Resend(key);
    return client;
}

// Remitente con el dominio verificado en Resend. Ejemplo: Homeopáticos Schüssler <pedidos@schussler.com.mx>
const from = () => process.env.EMAIL_FROM ?? "Homeopáticos Schüssler <pedidos@schussler.com.mx>";

export async function sendEmail(options: { to: string; subject: string; html: string; text?: string; replyTo?: string }) {
    const { error } = await resend().emails.send({ from: from(), ...options });
    if (error) throw new Error(`Resend: ${error.message}`);
}
