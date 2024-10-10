import nodemailer from "nodemailer";

export const feedbackAlert = async (
    userName: string,
    userOrganization: string,
    userEmail: string,
    feedbackType: string,
    feedbackDescription: string,
) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_HOST,
        auth: {
            user: process.env.FROM_EMAIL_ADDRESS,
            pass: process.env.FROM_EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.FROM_EMAIL_ADDRESS,
        to: process.env.TEAM_UPDATE_EMAIL_ADDRESS,
        bcc: process.env.TEAM_UPDATE_BCC_EMAIL_ADDRESSES,
        subject: "[Action Required] New Feedback Submitted",
        html: `
<html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        </style>
    </head>
    <body style="display: flex; justify-content: center; align-items: center; background-color: transparent;">
        <div style="max-width: 600px; background: #FBFBFB; border-radius: 10px; overflow: hidden;">
            <img style="display: block; max-height: 36px; width: auto; margin: 30px 0 40px 30px;" src="https://algorhythm-assets.s3.amazonaws.com/wordmark.png" alt="Wordmark"/>
            <div style="padding: 0 30px;">
                <h1 style="font-size: 22px; margin: 0 0 20px; font-weight: 700;">New feedback is available.</h1>
                <p style="font-size: 14px; margin: 0 0 10px;"><strong>Hello,</strong></p>
                <p style="font-size: 14px; margin: 0 0 10px;">This is an alert that <strong>${userName}</strong> from <strong>${userOrganization}</strong> has submitted feedback about their experience with Algorhythm. Please review and respond to this feedback as soon as possible.</p>
                <p style="font-size: 14px; margin: 0 0 10px;">The user has labeled their feedback as <strong>${feedbackType}</strong>. They said: "${feedbackDescription}"</p>
                <p style="font-size: 14px; margin: 0 0 10px;">If you need to contact the user, their email is ${userEmail}.</p>
                <p style="font-size: 14px; margin: 0 0 20px;">Algorhythm Team</p>
            </div>
            <div style="display: flex; justify-content: flex-start; padding: 0 30px 20px;">
                <a href="https://www.linkedin.com/company/algorhythmai"><img style="height: 20px; width: 20px; margin-right: 20px;" src="https://algorhythm-assets.s3.amazonaws.com/linkedin.png" alt="LinkedIn" /></a>
                <a href="https://x.com/algorhythmapp"><img style="height: 20px; width: 20px; margin-right: 20px;" src="https://algorhythm-assets.s3.amazonaws.com/x.png" alt="X" /></a>
                <a href="https://www.instagram.com/algorhythm.app"><img style="height: 20px; width: 20px;" src="https://algorhythm-assets.s3.amazonaws.com/instagram.png" alt="Instagram" /></a>
            </div>
            <div style="background: linear-gradient(90deg, #2622F1 0%, #12107C 100%); color: white; font-size: 12px; padding: 15px 30px;">
                <p style="margin: 0 0 5px;">You are receiving this email because you are an administrator of Algorhythm.</p>
                <p style="margin: 0;">If you feel you received it by mistake or wish to unsubscribe, please reply STOP.</p>
            </div>
        </div>
    </body>
</html>`,
    };

    await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject(err);
                return false;
            } else {
                resolve(info);
                return true;
            }
        });
    });

    return true;
};
