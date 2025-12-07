import { env } from "$env/dynamic/private"
import { z } from "zod";

const envSchema = z.object({
  AUTHPROXY_URL: z.url().optional(),
  AUTHPROXY_KEY: z.string().length(36).optional(),
}).partial()
.refine(
  v => !v.AUTHPROXY_URL || v.AUTHPROXY_KEY,
  { message: "AUTHPROXY_KEY required when AUTHPROXY_URL is set" }
)
.transform(obj => {
  return Object.values(obj).every(v => v === undefined) ? {} : obj
})



const environment = envSchema.parse(env);
export default environment;