import { env } from "$env/dynamic/private"
import { z } from "zod";

const envSchema = z.object({
  AUTHPROXY_URL: z.url().optional(),
  AUTHPROXY_KEY: z.string().length(36),
})


export default process.env.BUILDING ? {} as z.infer<typeof envSchema> : envSchema.parse(env);