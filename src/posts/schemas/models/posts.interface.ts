export interface IPost {
  id: string;
  title: string;
  description: string;
  image: string;
  createdAt?: Date;
  isPublished: boolean;
}
