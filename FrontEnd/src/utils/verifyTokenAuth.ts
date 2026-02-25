import * as SecureStore from "expo-secure-store";
import { envs } from "../config/envs";

const API_URL = envs.API_URL;

export interface userProps {
  token: string;
  userId: string;
}

export const verifyTokenAuth = async () => {
  try {
    const token: string | null = await SecureStore.getItemAsync("userToken");
    if (!token) {
      return null;
    }

    const rawResponsePersistLogin = await fetch(`${API_URL}/authPersist`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responsePersistLogin = await rawResponsePersistLogin.json();

    const userData: userProps = {
      token: token,
      userId: responsePersistLogin.data.id,
    };

    if (rawResponsePersistLogin.ok) {
      return userData;
    } else {
      await SecureStore.deleteItemAsync("userToken");
      return null;
    }
  } catch (err) {
    console.log("Error verifying the token", err);
    return null;
  }
};
