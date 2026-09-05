"use client"

import { useState } from "react"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    email: "",
    phone: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errorMessage) setErrorMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Ocorreu um erro ao enviar a mensagem.")
      }

      setIsSubmitted(true)
    } catch (err: any) {
      console.error(err)
      setErrorMessage(
        err.message || "Não foi possível enviar a mensagem. Tente novamente."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({
      name: "",
      subject: "",
      email: "",
      phone: "",
      message: "",
    })
    setIsSubmitted(false)
    setErrorMessage(null)
  }

  if (isSubmitted) {
    return (
      <div className="w-full bg-zinc-800/40 border border-emerald-500/30 rounded-2xl p-8 flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight">
          Mensagem enviada com sucesso!
        </h3>
        <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
          Obrigado pelo contato! Sua mensagem foi enviada diretamente para a minha caixa de entrada e responderei o mais breve possível.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-4 px-6 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white hover:bg-zinc-700 rounded-lg text-sm font-semibold transition-all"
        >
          Enviar outra mensagem
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 mt-4">
      {errorMessage && (
        <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-lg text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className="text-sm text-zinc-400">
            Nome Completo:
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Seu nome"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amigu-dark focus:ring-1 focus:ring-amigu-dark transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-subject" className="text-sm text-zinc-400">
            Assunto:
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            placeholder="Seu assunto"
            value={formData.subject}
            onChange={handleChange}
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amigu-dark focus:ring-1 focus:ring-amigu-dark transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="text-sm text-zinc-400">
            E-mail:
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="Seu e-mail"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amigu-dark focus:ring-1 focus:ring-amigu-dark transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-phone" className="text-sm text-zinc-400">
            Telefone:
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            placeholder="(00) 00000-0000"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amigu-dark focus:ring-1 focus:ring-amigu-dark transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="text-sm text-zinc-400">
          Mensagem:
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          placeholder="Escreva sua mensagem aqui"
          value={formData.message}
          onChange={handleChange}
          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amigu-dark focus:ring-1 focus:ring-amigu-dark transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-fit px-10 py-4 bg-amigu-dark text-emerald-950 rounded-lg font-semibold hover:brightness-110 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-950"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Enviando...
          </>
        ) : (
          <>
            Enviar Mensagem
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </>
        )}
      </button>
    </form>
  )
}
