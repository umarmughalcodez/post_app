interface PostProps {
  id: string;
  userEmail: string;
  image_url: string;
  title: string;
  description: string;
  _count: {
    likes: number;
    views: number;
  };
}
