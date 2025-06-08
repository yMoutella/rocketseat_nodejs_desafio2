import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import { userHandler } from "./routes/user";
import { mealHandler } from "./routes/meal";


export const app = fastify()

app.register(fastifyCookie)
app.register(userHandler, {
  prefix: '/user'
})
app.register(mealHandler, {

  prefix: '/user'
})
