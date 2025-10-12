export interface Project {
  id: string;
  slug: string;
  name: string;
  category: string;
  year: string;
  leader: string;
  description: string;
  image: string;
  images?: string[];
  awards?: string[];
  specifications: { label: string; value: string }[];
  order: number;
}
