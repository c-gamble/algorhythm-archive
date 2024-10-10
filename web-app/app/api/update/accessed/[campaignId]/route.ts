import { authOptions } from "@/lib/authOptions";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { campaignId: number } },
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id)
        return NextResponse.json({ error: "Not authorized" }, { status: 401 });

    const dbClient = createClient(
        process.env.SUPABASE_URL as string,
        process.env.SUPABASE_KEY as string,
    );

    const campaignResponse = await dbClient
        .from("campaigns")
        .select("*")
        .eq("id", params.campaignId);

    if (campaignResponse.error || campaignResponse.data.length === 0) {
        return NextResponse.json(
            { error: "Campaign not found" },
            { status: 404 },
        );
    }

    const campaign = campaignResponse.data[0];

    if (session.user.id !== campaign.user_id) {
        return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const updatedCampaignResponse = await dbClient
        .from("campaigns")
        .update({ accessed: new Date().toISOString() })
        .eq("id", params.campaignId);

    if (updatedCampaignResponse.error) {
        return NextResponse.json(
            { error: "Error updating campaign" },
            { status: 500 },
        );
    }

    return NextResponse.json({ message: "Campaign updated" }, { status: 200 });
}
