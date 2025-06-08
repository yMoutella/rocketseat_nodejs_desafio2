import 'dotenv/config'
import { app } from "./app"
import { env } from "./env"

app.listen({
    port: env!.PORT
}).then(() => {
    console.log(`HTTP server running on port ${env!.PORT}`)
})
