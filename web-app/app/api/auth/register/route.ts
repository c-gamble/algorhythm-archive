import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    try {
        const dbClient = createClient(
            process.env.SUPABASE_URL as string,
            process.env.SUPABASE_KEY as string,
        );

        const { name, email, password, inviteCode } = await req.json();

        const organizationResponse = await dbClient
            .from("organizations")
            .select("*")
            .eq("invite_code", inviteCode);

        if (
            organizationResponse.error ||
            organizationResponse.data.length === 0
        ) {
            return NextResponse.json(
                { error: "Could not find any matching organization." },
                { status: 400 },
            );
        }
        const organization = organizationResponse.data[0];

        if (!organization.allow_list.includes(email)) {
            return NextResponse.json(
                {
                    error: "You are not allowed to register for this organization.",
                },
                { status: 403 },
            );
        }

        const bcrypt = require("bcrypt");
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertionResponse = await dbClient.from("users").insert([
            {
                name,
                email,
                password: hashedPassword,
                organization: organization.id,
            },
        ]);

        if (insertionResponse.error) {
            return NextResponse.json(
                { error: insertionResponse.error.message },
                { status: insertionResponse.status },
            );
        }

        return NextResponse.json(
            { message: "Account created!" },
            { status: 201 },
        );
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: "There was an error registering your account." },
            { status: 500 },
        );
    }
}
