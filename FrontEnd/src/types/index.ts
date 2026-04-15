export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Home: undefined;
  UserProfileScreen: undefined;
  ExpensesAndSavingsScreen: {
    budgetId: string;
    budgetName?: string;
    budgetAmount: string;
    budgetCompleted: boolean;
  };
};

export type RootTabParamList = {
  ExpensesScreen: {
    budgetId: string;
    budgetName?: string;
    budgetAmount: string;
    budgetCompleted: boolean;
  };
  SavingsScreen: {
    budgetId: string;
    budgetName?: string;
    budgetAmount: string;
    budgetCompleted: boolean;
  };
};

//dam parametrii la ecrane doar cand avem nevoie de parametrii pe acel ecran cum ar fi id-ul unui task pe care il folosim in ecranul task-ului
//regula parametrii nu pot merge decat de la parinte la copil nu se pun si functiile de callBack
