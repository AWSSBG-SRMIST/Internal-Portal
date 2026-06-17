import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOTPEmail(email: string, otp: string, name: string = 'Member') {
  await transporter.sendMail({
    from: `"Internal Dashboard @AWSSBG-at-SRMIST" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Your OTP: ${otp} — AWSSBG Internal Dashboard`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:20px;background:#0f172a;">
  <div style="background:#1e293b;border-radius:12px;padding:36px;box-shadow:0 4px 24px rgba(0,0,0,0.4);border:1px solid #334155;">
    <div style="text-align:center;margin-bottom:28px;">
      <div style="background:#FF9900;display:inline-block;padding:10px 22px;border-radius:8px;">
        <span style="color:white;font-size:16px;font-weight:bold;">Internal Dashboard</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:8px 0 0;">@AWSSBG · SRM Institute of Science and Technology</p>
    </div>
    <h2 style="color:#e2e8f0;margin-bottom:6px;">Hello, ${name}!</h2>
    <p style="color:#94a3b8;margin-bottom:28px;">Your one-time password to sign in to the AWSSBG Internal Dashboard:</p>
    <div style="text-align:center;background:#0f172a;border-radius:12px;padding:28px;margin-bottom:28px;border:2px dashed #FF9900;">
      <span style="font-size:44px;font-weight:bold;letter-spacing:10px;color:#FF9900;">${otp}</span>
    </div>
    <p style="color:#64748b;font-size:13px;text-align:center;">Expires in <strong style="color:#94a3b8;">5 minutes</strong>. Do not share this with anyone.</p>
    <hr style="border:none;border-top:1px solid #334155;margin:20px 0;"/>
    <p style="color:#475569;font-size:11px;text-align:center;">AWS Student Builder Group &middot; SRMIST &middot; Internal use only</p>
  </div>
</body>
</html>`,
  });
}

export async function sendTaskReminderEmail(email: string, name: string, taskTitle: string, deadline: string, taskUrl: string) {
  const deadlineLabel = new Date(deadline).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  await transporter.sendMail({
    from: `"Internal Dashboard @AWSSBG-at-SRMIST" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Reminder: "${taskTitle}" is due soon — AWSSBG Internal Dashboard`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:20px;background:#0f172a;">
  <div style="background:#1e293b;border-radius:12px;padding:36px;box-shadow:0 4px 24px rgba(0,0,0,0.4);border:1px solid #334155;">
    <div style="text-align:center;margin-bottom:28px;">
      <div style="background:#FF9900;display:inline-block;padding:10px 22px;border-radius:8px;">
        <span style="color:white;font-size:16px;font-weight:bold;">Internal Dashboard</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:8px 0 0;">@AWSSBG · SRM Institute of Science and Technology</p>
    </div>
    <h2 style="color:#e2e8f0;margin-bottom:6px;">Hi ${name},</h2>
    <p style="color:#94a3b8;margin-bottom:20px;">You haven't submitted your work yet for:</p>
    <div style="background:#0f172a;border-radius:12px;padding:20px;margin-bottom:20px;border:1px solid #334155;">
      <p style="color:#e2e8f0;font-size:16px;font-weight:bold;margin:0 0 8px;">${taskTitle}</p>
      <p style="color:#FF9900;font-size:13px;margin:0;">Due: ${deadlineLabel}</p>
    </div>
    <div style="text-align:center;margin-bottom:24px;">
      <a href="${taskUrl}" style="background:#FF9900;color:white;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:bold;display:inline-block;">View Task</a>
    </div>
    <hr style="border:none;border-top:1px solid #334155;margin:20px 0;"/>
    <p style="color:#475569;font-size:11px;text-align:center;">AWS Student Builder Group &middot; SRMIST &middot; Internal use only</p>
  </div>
</body>
</html>`,
  });
}
