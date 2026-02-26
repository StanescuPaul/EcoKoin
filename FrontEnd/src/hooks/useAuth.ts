import { useEffect, useState } from "react";
import { verifyTokenAuth, userProps } from "../utils/verifyTokenAuth";

//custom hook pentru a seta isLoading si token din AppNavigation
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionData, setSessionData] = useState<userProps | null>(null);

  useEffect(() => {
    const checkUserAuth = async () => {
      const sessionData = await verifyTokenAuth();
      setSessionData(sessionData); //se asteapta datele de la functie si dupa se paseaza useAuth pentru a le trimite in AppNavigation
      setIsLoading(false);
    };
    checkUserAuth();
  }, []); //Acest hook se activeaza doar cand este prima data randata componenta pemntru ca folosim []

  return { sessionData, isLoading, setSessionData }; //returnam si setSesionData pentru a putea schimba si state-ul din useAuth
};
