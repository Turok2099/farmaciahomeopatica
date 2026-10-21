import { SignJWT, jwtVerify, type JWTPayload } from "jose";

// Sin next/headers: se puede importar desde proxy.ts y desde código de servidor.
function getKey() {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error("JWT_SECRET no está definido o tiene menos de 32 caracteres.");
    }
    return new TextEncoder().encode(secret);
}

export async function encrypt(payload: JWTPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1 week")
        .sign(getKey());
}

// Devuelve null si el token es inválido, está manipulado o expiró.
export async function decrypt(input: string): Promise<JWTPayload | null> {
    const key = getKey();
    try {
        const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });
        return payload;
    } catch {
        return null;
    }
}
