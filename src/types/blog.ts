export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    imageUrl?: string;
    isPublished: boolean;
    author: string;
    authorImage?: string;
    createdAt: string; // ISO string formatında
    updatedAt: string; // ISO string formatında
}