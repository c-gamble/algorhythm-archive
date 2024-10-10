import {
    Artist,
    ArtistCollaboration,
    BrandCollaboration,
    City,
    KeyTrait,
    NotableMoment,
    PieChartItem,
    PinterestImage,
    Playlist,
    SpecificMoodboardImages,
    Track,
} from "@/customTypes";

export type CampaignOutput = {
    id: number;
    date: string;
    accessed: string;
    trackInfo: Track;
    spotifyURL?: string;
    Analysis: {
        notableMoments: NotableMoment[];
        similarTracks: Track[];
        keyTraits: KeyTrait[];
        audioFeatures: {
            danceability: number; // danceability
            acousticLevel: number; // acousticness
            energy: number; // 1-relaxation
            vocalMode: number; // voiceness
            timbre: number; // warmth
            immersiveness: number; // immersiveness
        };
        additonalFeatures: {
            aggressiveness: number;
            electronicness: number;
            happiness: number;
            partiness: number;
            nicheness: number;
            sadness: number;
            themes: { name: string; value: number }[];
            tonality: number;
            vocalGender: string;
        };
        genres: { name: string; value: number }[];
    };
    Audience: {
        cities: City[];
        ageDistribution: PieChartItem[];
        sexDistribution: PieChartItem[];
        ethnicityDistribution: PieChartItem[];
        summary: string;
    };
    Engagement: {
        artistCollaborations: {
            larger: ArtistCollaboration[];
            perfect: ArtistCollaboration[];
            smaller: ArtistCollaboration[];
        };
        brandCollaborations: {
            larger: BrandCollaboration[];
            perfect: BrandCollaboration[];
            smaller: BrandCollaboration[];
        };
        editorialPlaylists: Playlist[];
        thirdPartyPlaylists: Playlist[];
    };
    CreativeVision: {
        moodboard: {
            keywords: string[];
            images: PinterestImage[];
        };
        similarCampaigns: Track[];
        suggestedCampaigns: SpecificMoodboardImages[];
    };
};
