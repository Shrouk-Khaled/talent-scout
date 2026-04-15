import adminHttp from "./adminHttp";
import http from "./http";

//login and otp verification
export const login = async (payload) => {
  const response = await http.post("/api/v1/auth/login", payload);
  return response;
};

export const verifyOtp = async (payload) => {
  const response = await http.post("/api/v1/auth/verify-otp", payload);
  return response;
}

export const resendOtp = async (payload) => {
  const response = await http.post("/api/v1/auth/send-otp", payload);
  return response;
}

//signup steps
export const checkPhoneExists = async (payload) => {
  const response = await http.get(`/api/v1/users/validate-phone?phone=${payload?.phone}`);
  return response;
}

export const getAllCategories = async () => {
  const response = await http.get("/api/v1/categories");
  return response;
}

export const getSubCatFormFields = async (subCategoryId) => {
  const response = await adminHttp.get(`/api/forms/subcategory/${subCategoryId}`);
  return response;
}

// export const draftSignupData = async (payload) => {
//   const formData = new FormData();

//   Object.entries(payload || {}).forEach(([key, value]) => {
//     if (value === undefined || value === null) return;

//     if (Array.isArray(value)) {
//       value.forEach((item) => formData.append(key, item));
//     } else if (value instanceof File || value instanceof Blob) {
//       formData.append(key, value);
//     } else {
//       formData.append(key, value);
//     }
//   });

//   const response = await http.post(
//     "/api/v1/auth/register/draft",
//     formData,
//     {}
//   );

//   return response;
// };

export const draftSignupData = async (payload, onProgress = null) => {
  const formData = new FormData();

  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
    } else if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else {
      formData.append(key, value);
    }
  });

  const response = await http.post(
    "/api/v1/auth/register/draft",
    formData,
    {
      timeout: 300000, // 5 دقائق
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    }
  );

  return response;
};

export const signupSpecialCases = async (payload) => {
  const formData = new FormData();

  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
    } else if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else {
      formData.append(key, value);
    }
  });
  const response = await http.post("/api/v1/talent/special-case", formData, {});
  return response;
}

export const confirmSignup = async (payload) => {
  const response = await http.post("/api/v1/auth/register/confirm", payload);
  return response;
}


// Home page
export const homePageSections = async (payload) => {
  const response = await http.get(`/api/v1/mawhebty-platform/home/sections?per_section_items_count=5&search=${payload?.search || ''}&section_type=${payload?.section_type >= 0 ? payload?.section_type : ''}`);
  return response;
}

export const getArticles = async (payload) => {
  const response = await http.get(`/api/v1/mawhebty-platform/articles?page=${payload?.page || 1}&per_page=6&sort_by=${payload?.sortby || ""}&sub_category_id=${payload?.sub_category}&search=${payload?.search || ''}&category_id=${payload?.category_id || ''}`);
  return response;
}

export const getEvents = async (payload) => {
  const response = await http.get(`/api/v1/mawhebty-platform/events?page=${payload?.page || 1}&per_page=6&sort_by=${payload?.sortby || ""}&sub_category_id=${payload?.sub_category}&search=${payload?.search || ''}&category_id=${payload?.category_id || ''}`);
  return response;
}

export const getPosts = async (payload) => {
  const response = await http.get(`/api/v1/mawhebty-platform/posts?page=${payload?.page || 1}&per_page=5&sort_by=${payload?.sortby || ""}&sub_category_id=${payload?.sub_category}&search=${payload?.search || ''}&category_id=${payload?.category_id || ''}`);
  return response;
}

export const getPostsByUserId = async (userId, payload) => {
  const response = await http.get(`/api/v1/mawhebty-platform/posts?owner_id=${userId}&page=${payload?.page || 1}&per_page=5`);
  return response;
}

export const getTalents = async (payload) => {
  const response = await http.get(`/api/v1/mawhebty-platform/talents?page=${payload?.page || 1}&per_page=6&sort_by=${payload?.sortby || ""}&sub_category_id=${payload?.sub_category}&search=${payload?.search || ''}&category_id=${payload?.category_id || ''}`);
  return response;
}

export const getTalentById = async (id) => {
  const response = await http.get(`/api/v1/mawhebty-platform/talents/${id}`);
  return response;
}

export const getArticleById = async (id) => {
  const response = await http.get(`/api/v1/mawhebty-platform/articles/${id}`);
  return response;
}

export const getEventById = async (id) => {
  const response = await http.get(`/api/v1/mawhebty-platform/events/${id}`);
  return response;
}

//profile apis
export const getUserInfo = async () => {
  const response = await http.get(`/api/v1/mawhebty-platform/profile/user`);
  return response;
}

export const getMyPosts = async () => {
  const response = await http.get(`/api/v1/mawhebty-platform/profile/user/posts`);
  return response;
}

export const getMySaved = async (payload) => {
  const response = await http.get(`/api/v1/mawhebty-platform/profile/user/saved-items?item_type=${payload?.itemType}&page=${payload?.page || 1}&per_page=5`);
  return response;
}

//saved
export const saveItem = async (payload) => {
  const response = await http.post(`/api/v1/mawhebty-platform/profile/user/save-item`, payload);
  return response;
}

export const unSavedItem = async (payload) => {
  const response = await http.post(`/api/v1/mawhebty-platform/profile/user/unsave-item`, payload);
  return response;
}

export const createPost = async (payload, onProgress = null) => {
  const formData = new FormData();

  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
    } else if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else {
      formData.append(key, value);
    }
  });

  const response = await http.post(
    "/api/v1/mawhebty-platform/posts",
    formData,
    {
      timeout: 300000, // 5 دقائق
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    }
  );

  return response;
}

//notifications
export const getAllNotifications = async (payload) => {
  const response = await http.get(`/api/v1/mawhebty-platform/notifications?page=${payload?.page || 1}&per_page=4`);
  return response;
}

export const getUnreadNotificationsCount = async () => {
  const response = await http.get(`/api/v1/mawhebty-platform/notifications/unread-count`);
  return response;
}

//reels
export const getReels = async (payload) => {
  const response = await http.get(`/api/v1/mawhebty-platform/posts/reels?page=${payload?.page || 1}&per_page=3`);
  return response;
}

//firebase token
export const saveFCMToken = async (payload) => {
  const response = await http.post(`/api/v1/mawhebty-platform/firebase/fcm-token`, payload);
  return response;
}

//contracts
export const getContracts = async (payload) => {
  const response = await http.get(`/api/v1/mawhebty-platform/contracts?page=${payload?.page || 1}&per_page=6`);
  return response;
}

export const getContractById = async (id) => {
  const response = await http.get(`/api/v1/mawhebty-platform/contracts/${id}`);
  return response;
}

export const sendContractRequest = async (payload) => {
  const response = await http.post(`/api/v1/mawhebty-platform/contracts`, payload);
  return response;
}

//refresh token
export const refreshToken = async (payload, refreshTokenValue) => {
  const response = await http.post(
    `/api/v1/auth/refresh`,
    payload,
    {
      headers: {
        'X-Refresh-Token': refreshTokenValue,
      },
    }
  );

  return response;
};

//delete account 
export const deleteAccount = async () => {
  const response = await http.delete(`/api/v1/mawhebty-platform/profile/user`);
  return response;
}

//action: Like post
export const likePost = async (payload) => {
  const response = await http.post(`/api/v1/mawhebty-platform/posts/${payload?.post_id}/like`, "");
  return response;
}

//action: unlike post
export const unlikePost = async (payload) => {
  const response = await http.delete(`/api/v1/mawhebty-platform/posts/${payload?.post_id}/like`, "");
  return response;
}