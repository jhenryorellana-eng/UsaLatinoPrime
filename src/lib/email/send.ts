import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'UsaLatinoPrime <noreply@usalatinoprime.com>',
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Email send error:', error)
    return null
  }
}
