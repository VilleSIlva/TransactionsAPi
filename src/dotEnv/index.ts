import "dotenv/config"
import {z} from "zod"


const schemaEnv = z.object({
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333),
    NODE_ENV: z.enum(['development','test','production']).default('production')
})

const _env = schemaEnv.safeParse(process.env);

if(_env.success === false){
    console.error("Invalid Enviroment env",_env.error.format())
    throw new Error("Invalid Enviroment env")
}

export const env = _env.data