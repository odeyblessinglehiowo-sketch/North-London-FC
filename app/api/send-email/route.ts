import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, firstName } = body;

    const data = await resend.emails.send({
      from: "North London FC <onboarding@resend.dev>",
      to: email,
      subject: "Registration Confirmed 🎉",
      html: `
        <div style="font-family:sans-serif;">
          <h2>You're in, ${firstName}! ⚽</h2>
          <p>Your spot for the Arsenal Watch Party has been confirmed.</p>
          <p>Get ready for an amazing experience 🔥</p>
        </div>
      `,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    console.log(error);
    return Response.json({ success: false });
  }
}