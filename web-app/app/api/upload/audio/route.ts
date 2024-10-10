import { authOptions } from "@/lib/authOptions";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            token: process.env.BLOB_READ_WRITE_TOKEN as string,
            body,
            request,
            onBeforeGenerateToken: async (pathname) => {
                const session = await getServerSession(authOptions);
                if (!session) {
                    throw new Error("Unauthorized");
                }
                return {
                    allowedContentTypes: ["audio/mpeg"],
                    tokenPayload: JSON.stringify({}),
                };
            },
            // doesn't work on localhost
            onUploadCompleted: async ({ blob, tokenPayload }) => {},
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 },
        );
    }
}
