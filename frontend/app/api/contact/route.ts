import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { name, subject, email, phone, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nome, e-mail e mensagem são campos obrigatórios." },
        { status: 400 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: "Amigulab <onboarding@resend.dev>",
      to: ["giulianotpt@gmail.com"],
      replyTo: email,
      subject: `[Amigulab] ${subject || "Contato do Portfólio"} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 12px; background-color: #fafafa;">
          <h2 style="color: #064e3b; margin-top: 0; border-bottom: 2px solid #b0db9c; padding-bottom: 12px;">
            🧶 Nova Mensagem Recebida - Amigulab
          </h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 0; color: #71717a; width: 140px; font-weight: bold;">Nome:</td>
              <td style="padding: 8px 0; color: #18181b; font-weight: 500;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #71717a; font-weight: bold;">E-mail:</td>
              <td style="padding: 8px 0; color: #18181b;"><a href="mailto:${email}" style="color: #047857; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #71717a; font-weight: bold;">Telefone:</td>
              <td style="padding: 8px 0; color: #18181b;">${phone || "Não informado"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #71717a; font-weight: bold;">Assunto:</td>
              <td style="padding: 8px 0; color: #18181b;">${subject || "Sem assunto"}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding: 16px; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px;">
            <p style="margin-top: 0; font-weight: bold; color: #27272a;">Mensagem:</p>
            <p style="color: #3f3f46; white-space: pre-wrap; line-height: 1.6; margin-bottom: 0;">${message}</p>
          </div>

          <p style="margin-top: 24px; font-size: 12px; color: #a1a1aa; text-align: center;">
            Você pode responder diretamente a este e-mail para falar com ${name}.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("Erro no envio do Resend:", error)
      return NextResponse.json(
        { error: error.message || "Falha ao enviar o e-mail." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error: any) {
    console.error("Erro interno no envio de mensagem:", error)
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar o envio." },
      { status: 500 }
    )
  }
}
