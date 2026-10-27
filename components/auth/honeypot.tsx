// Campo trampa contra bots: las personas no lo ven ni lo llenan; los bots sí. Ver isBot() en app/actions/auth.ts.
export function Honeypot() {
    return (
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="hp_contacto">No llenes este campo</label>
            <input id="hp_contacto" name="hp_contacto" type="text" tabIndex={-1} autoComplete="off" />
        </div>
    )
}
