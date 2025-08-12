export interface User {
  id?: string;
  name: string;
  email: string;
  image: string;
  bio?: string;
  premiumAccountHolder?: boolean;
  username?: string;
  _count: {
    followers: number;
    likes: number;
    views: number;
  };
  created_at?: string;
}
