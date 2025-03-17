interface ContentStructure {
    title: string;
    content: string;
    children: ContentStructure[];
}

interface TranscriptSummary {
    canSummary: boolean;
    summary: string;
    contentStructures: ContentStructure[];
    labels: string[];
}

export type {ContentStructure, TranscriptSummary}