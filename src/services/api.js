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
