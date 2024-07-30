import axios from "axios";
import { useState } from "react";
import { config } from "../../config.ts";
import { UserProfile } from "../../types/api/UserProfile.ts";
import { useNavigate } from "react-router-dom";

type Props = {
  username: string;
};

const useGetUserProfile = () => {
  const [response, setResponse] = useState<UserProfile | {}>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const getUserProfile = (props: Props) => {
    const { username } = props;
    setLoading(true);
    setError(false);
    axios
      .get(
        config.backendServer.baseURL +
          "/accounts/user-profile/get_userprofile/",
        { params: { username: username } }
      )
      .then((res) => {
        setResponse(res.data);
      })
      .catch((error) => {
        navigate("/", { state: { error: true } });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return { response, loading, error, getUserProfile };
};

export default useGetUserProfile;
