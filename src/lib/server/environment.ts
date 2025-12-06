import 'dotenv/config';
import { z } from "zod";

const envSchema = z.object({
  AUTHPROXY_URL: z.string().url(),
  AUTHPROXY_KEY: z.string(),
})


export default process.env.BUILDING ? {} as z.infer<typeof envSchema> : envSchema.parse(process.env);