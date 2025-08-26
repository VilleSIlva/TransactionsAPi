import {fastify} from "fastify";
import { env } from "./dotEnv";
import { transactions } from "./routes/transactions";
import {fastifyCookie} from "fastify-cookie";

const app = fastify();

app.register(fastifyCookie);
app.register(transactions,{
    prefix: "transactions"
});

app.listen({port:env.PORT}).then(()=>{
    console.log(`Running na port ${env.PORT}`);
});