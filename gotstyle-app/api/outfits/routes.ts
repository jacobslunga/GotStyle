export const OUTFIT_ROUTES = {
  GET_OUTFITS: "/outfits",
  GET_OUTFIT: "/outfits/:id",
  GET_COMMENT: "/outfits/:id/comment/:commentId",
  UPLOAD_OUTFIT: "/outfits/upload",
  LIKE_OUTFIT: "/outfits/:id/like",
  UNLIKE_OUTFIT: "/outfits/:id/unlike",
  SEARCH_OUTFITS_BY_HASHTAG: (hashtag: string) =>
    `/outfits/hashtags/${hashtag}`,
  COMMENT_OUTFIT: "/outfits/:id/comment",
  LIKE_COMMENT: "/outfits/:id/comment/:commentId/like",
  REPLY_COMMENT: "/outfits/:id/comment/:commentId/reply",
  UNLIKE_COMMENT: "/outfits/:id/comment/:commentId/unlike",
  SAVE_OUTFIT: "/outfits/:id/save",
  SEARCH_OUTFITS: (query: string) => `/outfits/search/${query}`,
  UNSAVE_OUTFIT: "/outfits/:id/unsave",
  DELETE_OUTFIT: "/outfits/:id",
};
