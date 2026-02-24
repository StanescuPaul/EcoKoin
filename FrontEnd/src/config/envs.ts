interface envsInterface {
  API_URL: string;
}

export const envs: envsInterface = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || "",
};
