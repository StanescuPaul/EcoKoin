export type RootStackParamList = {
  Home: { userData: string | undefined };
  Register: undefined;
  Login: { onLoginSuccesfully: (token: string) => void };
};

//dam parametrii la ecrane doar cand avem nevoie de parametrii pe acel ecran cum ar fi id-ul unui task pe care il folosim in ecranul task-ului
