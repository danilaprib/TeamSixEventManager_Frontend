export interface EventModel {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: number;
  imageUrl: string;
  isInWishlist: boolean;
  isLiked: boolean;
  likesCount: number;
}