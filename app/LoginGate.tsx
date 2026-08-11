"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";

const VALID_EMAIL = "saulvc";
const VALID_PASSWORD = "123456";

export default function LoginGate({ children }: { children: ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthed(localStorage.getItem("integr-authed") === "true");
    setChecked(true);
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (email.trim().toLowerCase() === VALID_EMAIL && password === VALID_PASSWORD) {
      localStorage.setItem("integr-authed", "true");
      setAuthed(true);
      setError("");
    } else {
      setError("Correo o contraseña incorrectos.");
    }
  }

  if (!checked) return null;

  if (!authed) {
    return <div className="login-gate">
      <form className="login-card" onSubmit={handleSubmit}>
        <img src="/integr-logo.png" alt="INTEGR" />
        <h1>Curso de Certificación</h1>
        <p>Ingresa tus credenciales para continuar.</p>
        <label><span>Correo</span><input type="text" value={email} onChange={(event) => setEmail(event.target.value)} autoFocus autoCapitalize="off" autoCorrect="off" /></label>
        <label><span>Contraseña</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error && <p className="login-error">{error}</p>}
        <button type="submit">Entrar <span>→</span></button>
      </form>
    </div>;
  }

  return <>{children}</>;
}
