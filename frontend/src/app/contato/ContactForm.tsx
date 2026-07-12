"use client";

import { useState } from "react";

const inputClass =
  "border-0 border-b border-[#2a2a2a] bg-transparent px-0 py-3 text-lg text-white placeholder:text-[#555] focus:border-[#888]";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending" || status === "sent") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name") ?? "",
          email: data.get("email") ?? "",
          company: data.get("company") ?? "",
          message: data.get("message") ?? "",
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  const label =
    status === "sent"
      ? "Mensagem enviada ✓"
      : status === "sending"
        ? "Enviando…"
        : "Enviar mensagem";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-9">
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <label className="flex flex-col gap-3 text-sm text-[#9a9a9a]">
          Nome
          <input
            type="text"
            name="name"
            required
            placeholder="Seu nome"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-3 text-sm text-[#9a9a9a]">
          E-mail
          <input
            type="email"
            name="email"
            required
            placeholder="voce@empresa.com"
            className={inputClass}
          />
        </label>
      </div>
      <label className="flex flex-col gap-3 text-sm text-[#9a9a9a]">
        Empresa
        <input
          type="text"
          name="company"
          placeholder="Nome da empresa"
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-3 text-sm text-[#9a9a9a]">
        Sobre o projeto
        <textarea
          name="message"
          rows={5}
          required
          placeholder="O que você quer construir ou transformar?"
          className={`${inputClass} resize-y`}
        />
      </label>
      <div>
        <button
          type="submit"
          disabled={status === "sending" || status === "sent"}
          className="glow-border glow-border--dark cursor-pointer rounded-[10px] border-0 bg-white px-[34px] py-4 text-[15px] font-medium text-[#0a0a0a] transition-colors hover:bg-[#d9d9d9] disabled:cursor-default disabled:hover:bg-white"
        >
          {label}
        </button>
        {status === "error" && (
          <p className="mt-4 text-sm text-[#e08585]">
            Não foi possível enviar agora. Tente novamente ou escreva para o
            nosso e-mail.
          </p>
        )}
      </div>
    </form>
  );
}
