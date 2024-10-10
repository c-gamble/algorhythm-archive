import { CampaignOutput } from "@/customTypes";

export type UserData = {
    id: number;
    email: string;
    name: string;
    creditsRemaining: number;
    isFirstLogin: boolean;
    campaigns: CampaignOutput[];
};
