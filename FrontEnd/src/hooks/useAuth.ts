import { useEffect, useState } from "react";
import { verifyTokenAuth, userProps } from "../utils/verifyTokenAuth";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authData, setAuthData] = useState<userProps | null>(null);

  useEffect(() => {
    const checkUserAuth = async () => {
      const userData = await verifyTokenAuth();
      setAuthData(userData);
      setIsLoading(false);
    };
    checkUserAuth();
  }, []);

  return { authData, isLoading };
};
