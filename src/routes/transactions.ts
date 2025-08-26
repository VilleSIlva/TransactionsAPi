import { FastifyInstance,FastifyReply,FastifyRequest } from "fastify";
import  {randomUUID} from "node:crypto"
import z from "zod";
import { knex } from "../database";

export async function transactions(app:FastifyInstance){

   app.post("/create",async(req,res)=>{
      const schemaBody = z.object({
         title: z.string(),
         amount: z.number(),
         payments: z.enum(['debit','credit'])
      })

      const {amount,title,payments} = schemaBody.parse(req.body);

      let sessionId = req.cookies.sessionId     
      
      if(!sessionId){
         sessionId = randomUUID()
         res.setCookie("sessionId",sessionId,{
            path: "/",
            maxAge: 60 * 60 * 24 * 7 // 7days
         })
      }

      await knex('transactions').insert({
         id:randomUUID(),
         title,
         amount: payments == 'debit' ? amount * -1 : amount,
         payments: payments,
         session_id: sessionId
      });

      return res.send();
        
   })

   app.get('/:id',async(req:FastifyRequest,res:FastifyReply)=>{
      const schemaParams = z.object({
         id: z.uuid()
      })

      const {id} = schemaParams.parse(req.params)

      const transaction = await knex('transactions').where("id",id).first();

      if(!transactions){
         return res.status(404).send("not found")
      }

      if(transaction.session_id != req.cookies.sessionId){
         return res.status(401).send("no authorizate")
      }

      return {
         transaction
      }
   })

   app.get('/',async(req,res)=>{
      const transactions = await knex('transactions').where({"session_id":req.cookies.sessionId});

      return {
         transactions
      }
   })
}