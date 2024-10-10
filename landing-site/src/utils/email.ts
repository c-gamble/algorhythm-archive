import nodemailer from "nodemailer";

export const sendUpdateToTeam = async (
    name: string,
    emailAddress: string,
    organization: string,
    createdAt: Date,
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
        subject: "[Action Required] New Waitlist Signup",
        html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${emailAddress}</p>
        <p><strong>Organization:</strong> ${organization}</p>
        <p><strong>Submitted At:</strong> ${createdAt.toString()}</p>
        `,
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

export const sendUserConfirmation = async (
    name: string,
    emailAddress: string,
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
        to: emailAddress,
        subject: "Welcome to Algorhythm",
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
                <h1 style="font-size: 22px; margin: 0 0 20px; font-weight: 700;">Thanks for signing up.</h1>
                <p style="font-size: 14px; margin: 0 0 10px;"><strong>Hello ${name},</strong></p>
                <p style="font-size: 14px; margin: 0 0 10px;">Welcome to Algorhythm! A team member will reach out within 1-3 business days to set up a <strong>Discovery Meeting</strong>. There, we'll learn about your team's needs and how Algorhythm can help.</p>
                <p style="font-size: 14px; margin: 0 0 10px;">If you've already connected with us, stay tuned for details about scheduling a <strong>live demo</strong>.</p>
                <p style="font-size: 14px; margin: 0 0 10px;">For any questions, please contact <strong>team@algorhythm.app</strong>.</p>
                <p style="font-size: 14px; margin: 0 0 10px;">Thank you for your interest. We're excited to help your artists break through the noise.</p>
                <p style="font-size: 14px; margin: 0 0 20px;">Algorhythm Team</p>
            </div>
            <div style="display: flex; justify-content: flex-start; padding: 0 30px 20px;">
                <a href="https://www.linkedin.com/company/algorhythmai"><img style="height: 20px; width: 20px; margin-right: 20px;" src="https://algorhythm-assets.s3.amazonaws.com/linkedin.png" alt="LinkedIn" /></a>
                <a href="https://x.com/algorhythmapp"><img style="height: 20px; width: 20px; margin-right: 20px;" src="https://algorhythm-assets.s3.amazonaws.com/x.png" alt="X" /></a>
                <a href="https://www.instagram.com/algorhythm.app"><img style="height: 20px; width: 20px;" src="https://algorhythm-assets.s3.amazonaws.com/instagram.png" alt="Instagram" /></a>
            </div>
            <div style="background: linear-gradient(90deg, #2622F1 0%, #12107C 100%); color: white; font-size: 12px; padding: 15px 30px;">
                <p style="margin: 0 0 5px;">You are receiving this email because you signed up for Algorhythm communications.</p>
                <p style="margin: 0;">If you feel you received it by mistake or wish to unsubscribe, please reply STOP.</p>
            </div>
        </div>
    </body>
</html>`,
    };

    await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
                return false;
            } else {
                console.log(info);
                resolve(info);
                return true;
            }
        });
    });

    return true;
};
