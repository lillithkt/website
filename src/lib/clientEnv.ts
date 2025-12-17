import { env } from "$env/dynamic/public"
import { z } from "zod";
import { config as dotenv } from "dotenv";

export const publicEnvSchema = z.object({
  PUBLIC_LASTFM_API_KEY: z.string().optional(),
  PUBLIC_LASTFM_USER: z.string().optional(),
}).partial()
// make sure AUTHPROXY_URL and _KEY are set together
.refine(
  v => !!v.PUBLIC_LASTFM_API_KEY === !!v.PUBLIC_LASTFM_USER,
  { message: "LASTFM_API_KEY and LASTFM_USER must be set together" }
)


const clientEnv = publicEnvSchema.parse(env);
export default clientEnv;