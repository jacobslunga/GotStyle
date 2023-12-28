interface UserMinimal {
  id: string;
  username: string;
  image_url: string | null;
  color: string | null;
  name: string | null;
  has_posted_today: boolean;
  is_private: boolean;
}

interface OutfitUser {
  id: string;
  username: string;
  image_url: string | null;
  color: string | null;
  name: string | null;
  has_posted_today: boolean;
  followers: UserMinimal[];
}

interface User extends UserMinimal {
  email: string;
  created_at: Date;
  bio: string | null;
  updated_at: Date;
  outfits: Outfit[];
  sex: string | null;
  saved_outfits: Outfit[];
  following: UserMinimal[];
  followers: UserMinimal[];
}

interface OutfitMinimal {
  id: string;
  photo_url: string;
  video_url: string | null;
  shoes_url: string | null;
  outfit_images: any[];
  user_id: string;
  style: string | null;
}

interface Outfit extends OutfitMinimal {
  created_at: Date;
  likes: {
    count: number;
    users: UserMinimal[];
  };
  saves: {
    count: number;
    users: UserMinimal[];
  };
  comments: Comment[];
  updated_at: Date;
  description: string | null;
  user: OutfitUser;
  hashtags: string[];
}

interface OutfitHashtag {
  id: string;
  outfit_id: string;
  hashtag: string;
}

interface Comment {
  id: string;
  text: string;
  user_id: string;
  outfit_id: string;
  created_at: Date;
  likes: UserMinimal[];
  user: UserMinimal;
  answers: {
    id: string;
    text: string;
    user: {
      id: string;
      username: string;
      image_url: string | null;
      name: string | null;
    };
    commenter: {
      id: string;
      username: string;
      image_url: string | null;
      name: string | null;
    };
    reply_to_username: string;
  }[];
}

interface FollowRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  timestamp: Date;
  status: "Pending" | "Accepted" | "Rejected";
}

interface Notification {
  id: string;
  user_id: string;
  content: string;
  timestamp: Date;
  is_read: boolean;
  notification_type: string;
}

export type {
  UserMinimal,
  User,
  OutfitMinimal,
  Outfit,
  OutfitHashtag,
  Comment,
  FollowRequest,
  Notification,
};
