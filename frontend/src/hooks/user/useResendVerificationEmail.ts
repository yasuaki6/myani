import useAuthBaseAPI from "../useAuthBaseAPI.ts";

const useResendVerificationEmail = () => {
  const { authBaseAPI, response, loading } = useAuthBaseAPI();
  const resendVerificationEmail = () => {
    authBaseAPI({
      url: "accounts/user/resend_email_verification/",
      httpMethod: "GET",
    });
  };
  return { resendVerificationEmail, response, loading };
};

export default useResendVerificationEmail;
