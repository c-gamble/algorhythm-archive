import { createClient } from "@supabase/supabase-js";
import { sendUpdateToTeam, sendUserConfirmation } from "@/utils/email";

export async function POST(req: Request) {
    const body = await req.json();

    const { name, organization, email } = body;

    try {
        const supabaseClient = createClient(
            process.env.SUPABASE_URL || "",
            process.env.SUPABASE_KEY || "",
        );

        const existingEmailsResponse = (await supabaseClient
            .from("signups")
            .select("*")) as any;
        const existingEmails = existingEmailsResponse.data.map(
            (signup: any) => signup.email,
        );

        if (existingEmails.includes(email)) {
            throw new Error("You have already signed up!");
        }

        const { data, error } = await supabaseClient
            .from("signups")
            .insert([{ name, organization, email }]);

        if (error) {
            throw new Error(error.message);
        }

        const teamUpateResult: any = await sendUpdateToTeam(
            name,
            email,
            organization,
            new Date(),
        );
        if (!teamUpateResult) {
            throw new Error("Failed to send update to team.");
        }

        const userConfirmationResult: any = await sendUserConfirmation(
            name,
            email,
        );
        if (!userConfirmationResult) {
            throw new Error("Failed to send confirmation to user.");
        }
    } catch (error: any) {
        if (error.message === "You have already signed up!") {
            return Response.json(
                {
                    message: error.message,
                    ok: false,
                },
                {
                    status: 400,
                },
            );
        } else {
            return Response.json(
                {
                    message: "An error occurred. Please try again.",
                    ok: false,
                },
                {
                    status: 400,
                },
            );
        }
    }

    return Response.json({
        message: "Your message was sent!",
        ok: true,
        name,
        organization,
        email,
    });
}
