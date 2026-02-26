import * as SecureStore from "expo-secure-store";
import { envs } from "../config/envs";

const API_URL = envs.API_URL;

export interface userProps {
  token: string;
  userId: string;
}
//verificam token daca a expirat sau nu prin ruta /authPersist si feth-uim si userId pentru a il pasa spre HomeScreen prin useAuth
export const verifyTokenAuth = async () => {
  try {
    const token: string | null = await SecureStore.getItemAsync("userToken");
    if (!token) {
      return null;
    }

    const rawResponsePersistLogin = await fetch(`${API_URL}/api/authPersist`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responsePersistLogin = await rawResponsePersistLogin.json();

    if (rawResponsePersistLogin.ok) {
      const sesionData: userProps = {
        token: token,
        userId: responsePersistLogin.data.id,
      };
      return sesionData;
    } else {
      // daca nu e ok raspunsul inseamna ca e o eraore cu token-ul sau a expirat
      console.log(responsePersistLogin.message);
      await SecureStore.deleteItemAsync("userToken");
      return null;
    }
  } catch (err) {
    console.log("Error verifying the token", err);
    return null;
  }
};
