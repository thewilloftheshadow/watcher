import dotEnvExtended from "dotenv-extended"
dotEnvExtended.load()

import {Client, PresenceStatus} from "discord.js"
import express, { Application } from "express"

const management = "958566416691367937"

const app: Application = express()
const client = new Client({intents: ["GUILD_MEMBERS", "GUILD_PRESENCES"]})

console.log(`Started`)

client.on("ready", () => {
    app.listen(8080)    
})

app.get("/", (req, res) => {
    res.sendStatus(200)
})

app.get("/status/:id", async (req, res) => {
    const { id } = req.params
    const guild = client.guilds.cache.get(management)
    if(!guild) return res.sendStatus(500)

    const user = await guild.members.fetch(id)
    if(!user) return res.sendStatus(404)

    const status = user.presence.status
    if(status === "offline") return res.sendStatus(403)
    return res.json(user.presence)
})
