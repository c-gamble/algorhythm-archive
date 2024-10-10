import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { UserData } from "@/customTypes";
import { createClient } from "@supabase/supabase-js";

export async function GET(
    req: Request,
    { params }: { params: { id: string } },
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id)
        return NextResponse.json({ error: "Not authorized" }, { status: 401 });

    const id = parseInt(params.id);
    if (!id || session.user.id !== id) {
        return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const dbClient = createClient(
        process.env.SUPABASE_URL as string,
        process.env.SUPABASE_KEY as string,
    );

    const userResponse = await dbClient
        .from("users")
        .select("*")
        .eq("id", session.user?.id);
    if (userResponse.error || userResponse.data.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userResponse.data[0];

    const campaignResponse = await dbClient
        .from("campaigns")
        .select("*")
        .eq("user_id", user.id);
    if (campaignResponse.error) {
        return NextResponse.json(
            { error: "Error fetching campaigns" },
            { status: 500 },
        );
    }

    const campaigns = campaignResponse.data;

    const organizationResponse = await dbClient
        .from("organizations")
        .select("*")
        .eq("id", user.organization);

    if (organizationResponse.error || organizationResponse.data.length === 0) {
        return NextResponse.json(
            { error: "Organization not found" },
            { status: 404 },
        );
    }

    const organization = organizationResponse.data[0];

    const userData: UserData = {
        id: user.id,
        email: session.user?.email as string,
        name: user.name,
        creditsRemaining: organization.credits_remaining,
        isFirstLogin: user.is_first_login,
        campaigns: campaigns.map((campaign) => ({
            id: campaign.id,
            date: campaign.date,
            accessed: campaign.accessed,
            trackInfo: campaign.track_info,
            Analysis: campaign.analysis,
            Audience: campaign.audience,
            Engagement: campaign.engagement,
            CreativeVision: campaign.creative_vision,
        })),
    };

    return NextResponse.json({ status: 200, data: userData });
}
