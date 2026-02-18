import app from "./app";
import { envs } from "./config/envs";

app.listen(envs.PORT, () => {
  console.log(`Server is listening on PORT: ${envs.PORT}`);
});
