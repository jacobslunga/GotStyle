import api from "../api";
import { OUTFIT_ROUTES } from "./routes";

async function getOutfits(access_token: string) {
  try {
    const response = await api.get(OUTFIT_ROUTES.GET_OUTFITS, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getOutfit(id: string, access_token: string) {
  try {
    const response = await api.get(`/outfits/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function searchOutfits(access_token: string, query: string) {
  try {
    const response = await api.get(OUTFIT_ROUTES.SEARCH_OUTFITS(query), {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function uploadOutfit(data: {
  style: string;
  description: string;
  hashtags: string[] | null;
  access_token: string;
  outfit_links: any[];
  outfit_images: any[];
}) {
  const outfitData = {
    style: data.style,
    description: data.description,
    hashtags: data.hashtags,
    video_url: "",
    outfit_links: data.outfit_links,
    outfit_images: data.outfit_images,
  };

  try {
    const response = await api.post(OUTFIT_ROUTES.UPLOAD_OUTFIT, outfitData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function likeOutfit(access_token: string, outfitId: string) {
  try {
    const response = await api.post(
      `/outfits/${outfitId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function unlikeOutfit(access_token: string, outfitId: string) {
  try {
    const response = await api.post(
      `/outfits/${outfitId}/unlike`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function commentOutfit(
  access_token: string,
  outfitId: string,
  text: string
) {
  try {
    const response = await api.post(
      `/outfits/${outfitId}/comment`,
      {
        text,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function likeComment(
  access_token: string,
  outfitId: string,
  commentId: string
) {
  try {
    const response = await api.post(
      `/outfits/${outfitId}/comment/${commentId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getComment(
  access_token: string,
  outfitId: string,
  commentId: string
) {
  try {
    const response = await api.get(
      `/outfits/${outfitId}/comment/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function unlikeComment(
  access_token: string,
  outfitId: string,
  commentId: string
) {
  try {
    const response = await api.post(
      `/outfits/${outfitId}/comment/${commentId}/unlike`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function saveOutfit(access_token: string, outfitId: string) {
  try {
    const response = await api.post(
      `/outfits/${outfitId}/save`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function replyComment(
  access_token: string,
  outfitId: string,
  commentId: string,
  text: string
) {
  try {
    const response = await api.post(
      `/outfits/${outfitId}/comment/${commentId}/reply`,
      {
        text,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function unsaveOutfit(access_token: string, outfitId: string) {
  try {
    const response = await api.post(
      `/outfits/${outfitId}/unsave`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const outfitService = {
  getOutfit,
  getOutfits,
  uploadOutfit,
  likeOutfit,
  unlikeOutfit,
  commentOutfit,
  likeComment,
  unlikeComment,
  saveOutfit,
  unsaveOutfit,
  searchOutfits,
  getComment,
  replyComment,
};
