import { Artist } from "@/customTypes";

export type Track = {
    name: string;
    artist: Artist;
    imageURL: string;
    s3Key?: string;
};
