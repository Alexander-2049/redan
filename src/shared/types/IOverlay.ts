export interface IOverlay {
  displayName: string;
  folderName: string;
  author: string | null;
  image: string;
  description: string;
  lastModified: number;
  downloads: number;
  rating: number;
  category: string;
}
