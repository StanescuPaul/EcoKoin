import { useEffect, useState } from "react";
import { verifyTokenAuth, userProps } from "../utils/verifyTokenAuth";

//custom hook pentru a seta isLoading si token din AppNavigation
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sesionData, setSesionData] = useState<userProps | null>(null);

  useEffect(() => {
    const checkUserAuth = async () => {
      const sesionData = await verifyTokenAuth();
      setSesionData(sesionData); //se asteapta datele de la functie si dupa se paseaza useAuth pentru a le trimite in AppNavigation
      setIsLoading(false);
    };
    checkUserAuth();
  }, []); //Acest hook se activeaza doar cand este prima data randata componenta pemntru ca folosim []

  return { sesionData, isLoading, setSesionData };
};
