import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const s3Client = new S3Client({
        region: process.env.AWS_REGION as string,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        },
    });

    try {
        const url = new URL(req.url);

        const imageURL = decodeURIComponent(
            url.searchParams.get("imageURL") as string,
        );

        if (!imageURL) {
            return NextResponse.json(
                { message: "Image URL is required" },
                { status: 400 },
            );
        }

        const getObjectParams = {
            Bucket: process.env.S3_BUCKET_NAME as string,
            Key: imageURL.split(
                `${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`,
            )[1],
        };

        const command = new GetObjectCommand(getObjectParams);
        const response = await s3Client.send(command);

        if (!response.Body) {
            throw new Error("Empty response body");
        }

        const arrayBuffer = await response.Body.transformToByteArray();
        const buffer = Buffer.from(arrayBuffer);

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": response.ContentType || "image/png",
                "Cache-Control": "no-store, max-age=0",
            },
        });
    } catch (error: any) {
        console.error("Full error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
