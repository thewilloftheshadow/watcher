import { Client, GuildMember, PresenceStatus } from "discord.js"
import express, { Application } from "express"

const app: Application = express()
const client = new Client({ intents: "GUILD_MEMBERS" })
client.login(process.env.TOKEN)

app.get("/", (req, res) => {
    res.sendStatus(200)
})

app.get("/status/:id", async (req, res) => {
    const { id } = req.params
    let member: GuildMember
    client.guilds.cache.every((guild) => {
        const mem = guild.members.resolve(id)
        if(mem) {
            member = mem
            return false
        }
    })

    if(!member || !member.user.bot) return res.sendStatus(404)

    const status: PresenceStatus = member.presence.status

    if(status === "offline") return res.sendStatus(503)
    return res.sendStatus(200)

})
app.listen(process.env.PORT)
