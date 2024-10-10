import { authOptions } from "@/lib/authOptions";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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
        const { fileKey } = await req.json();

        if (!fileKey) {
            return NextResponse.json(
                { message: "File key is required" },
                { status: 400 },
            );
        }

        const getObjectParams = {
            Bucket: process.env.S3_BUCKET_NAME as string,
            Key: fileKey,
        };

        const command = new GetObjectCommand(getObjectParams);
        const response = await s3Client.send(command);

        if (!response.Body) {
            return NextResponse.json(
                { message: "File not found" },
                { status: 404 },
            );
        }

        const arrayBuffer = await response.Body.transformToByteArray();
        const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });

        // Convert the Blob to a base64 string
        const buffer = Buffer.from(await blob.arrayBuffer());
        const base64 = buffer.toString("base64");

        return NextResponse.json({ blob: base64 }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 },
        );
    }
}
