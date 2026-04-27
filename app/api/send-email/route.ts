import { Resend } from "resend";

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  if (!process.env.RESEND_API_KEY) {
    return Response.json({ error: "Missing API key" });
  }

  try {
    const body = await req.json();

    const { email, firstName } = body;

    await resend.emails.send({
      from: "North London FC <onboarding@resend.dev>",
      to: email,
      subject: "Registration Confirmed 🎉",
      html: `
        <h2>You're in, ${firstName}! ⚽</h2>
        <p>Your registration is confirmed.</p>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.log(error);
    return Response.json({ success: false });
  }
}