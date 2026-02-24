interface envsInterface {
  API_URL: string;
}

export const envs: envsInterface = {
  API_URL: process.env.API_URL || "",
};
