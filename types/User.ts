export interface User {
  id?: string;
  name: string;
  email: string;
  image: string;
  bio?: string;
  premiumAccountHolder?: boolean;
  username?: string;
  created_at?: string;
}
