import api from "../api";
import { USER_ROUTES } from "./routes";

async function signUp(data: {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    const response = await api.post(USER_ROUTES.SIGNUP, {
      email: data.email,
      username: data.username,
      password: data.password,
      confirm_password: data.confirmPassword,
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw { message: error.response.data.message };
    } else {
      throw error;
    }
  }
}

async function login(data: { credential: string; password: string }) {
  try {
    const response = await api.post(USER_ROUTES.LOGIN, data);

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw { message: error.response.data.message };
    } else {
      throw error;
    }
  }
}

async function getMe(accessToken: string) {
  try {
    const response = await api.get(USER_ROUTES.GET_ME, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getFollowingOutfits(accessToken: string, userId: string) {
  try {
    const response = await api.get(USER_ROUTES.GET_FOLLOWING_OUTFITS(userId), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getUserById(accessToken: string, userId: string) {
  try {
    const response = await api.get(USER_ROUTES.GET_USER(userId), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getUnreadNotifications(accessToken: string) {
  try {
    const response = await api.get(USER_ROUTES.GET_UNREAD_NOTIFICATIONS, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getReadNotifications(accessToken: string) {
  try {
    const response = await api.get(USER_ROUTES.GET_READ_NOTIFICATIONS, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getAvailableUsernames(username: string) {
  try {
    const response = await api.get(USER_ROUTES.GET_AVAILABLE_USERNAMES, {
      params: {
        username,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getAvailableEmails(email: string) {
  try {
    const response = await api.get(USER_ROUTES.GET_AVAILABLE_EMAILS, {
      params: {
        email,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getHasPostedToday(access_token: string) {
  try {
    const response = await api.get(USER_ROUTES.GET_HAS_POSTED_TODAY, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function searchUsers(accessToken: string, query: string) {
  try {
    const response = await api.get(USER_ROUTES.SEARCH_USERS(query), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function updateMe(
  accessToken: string,
  data: {
    photo_base64: string;
    bio: string;
    name: string;
    sex: string | null;
    email: string;
    is_private: boolean;
    username: string;
  }
) {
  try {
    const response = await api.put(USER_ROUTES.UPDATE_ME, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function updateExpoPushToken(
  accessToken: string,
  data: { expo_push_token: string }
) {
  try {
    const response = await api.put(USER_ROUTES.ADD_EXPO_PUSH_TOKEN, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function addBasicSettings(data: {
  photo_base64: string;
  bio: string;
  name: string;
  is_private: boolean;
  access_token: string;
}) {
  try {
    const response = await api.put(
      USER_ROUTES.BASIC_SETTINGS,
      {
        photo_base64: data.photo_base64,
        bio: data.bio,
        name: data.name,
        is_private: data.is_private,
      },
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function followUser(accessToken: string, data: { user_id: string }) {
  try {
    const response = await api.put(USER_ROUTES.FOLLOW_USER, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function unfollowUser(accessToken: string, data: { user_id: string }) {
  try {
    const response = await api.put(USER_ROUTES.UNFOLLOW_USER, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function rejectFollowRequest(
  access_token: string,
  data: { user_id: string }
) {
  try {
    const response = await api.put(USER_ROUTES.REJECT_FOLLOW_REQUEST, data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function acceptFollowRequest(
  access_token: string,
  data: { follower_id: string }
) {
  try {
    const response = await api.put(USER_ROUTES.ACCEPT_FOLLOW_REQUEST, data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function readNotifications(access_token: string) {
  try {
    const response = await api.post(
      USER_ROUTES.READ_NOTIFICATIONS,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function readNotification(access_token: string, notification_id: string) {
  try {
    const response = await api.put(
      USER_ROUTES.READ_NOTIFICATION,
      {
        notification_id,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const userService = {
  signUp,
  login,
  getMe,
  getUserById,
  getUnreadNotifications,
  getHasPostedToday,
  getReadNotifications,
  getAvailableUsernames,
  getAvailableEmails,
  searchUsers,
  updateMe,
  addBasicSettings,
  followUser,
  unfollowUser,
  updateExpoPushToken,
  readNotifications,
  acceptFollowRequest,
  rejectFollowRequest,
  readNotification,
  getFollowingOutfits,
};
