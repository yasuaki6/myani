export const config = {
  backendServer: {
    baseURL: process.env.REACT_APP_BASE_URL,
  },
};

export const passwordRegex = new RegExp(process.env.REACT_APP_PASSWORD_REGEX);
export const emailRegex = new RegExp(process.env.REACT_APP_EMAIL_REGEX, "i");
export const staticServerBaseURL = process.env.REACT_APP_STATIC_BASE_URL;
