export interface Message {
    author: string;
    content: string;
    date: string;
}

export interface ChannelProps {
    _id?:string;
    id?: string;
    username: string;
    isActive?: boolean;
    title: string;
    description: string;
    avatarUrl: string;
    thumbnailUrl: string;
    streamUrl?: string;
    streamKey?: string;
    viewers?: number;
    messages?: Message[];
}