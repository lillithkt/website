import { env } from "$env/dynamic/private"
import { z } from "zod";
import { config as dotenv } from "dotenv";
if (process.env.TESTENV) dotenv({ path: ".env.example" })

const envSchema = z.object({
  AUTHPROXY_URL: z.url().optional(),
  AUTHPROXY_KEY: z.string().length(36).optional(),
}).partial()
// make sure AUTHPROXY_URL and _KEY are set together
.refine(
  v => !!v.AUTHPROXY_URL === !!v.AUTHPROXY_KEY,
  { message: "AUTHPROXY_URL and AUTHPROXY_KEY must be set together" }
)


const environment = envSchema.parse(env);
export default environment;