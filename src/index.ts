import dotEnvExtended from "dotenv-extended"
dotEnvExtended.load()

import { REST } from "@discordjs/rest"
import {
    APIGuildMember,
    APIGuildWidget,
    APIUser,
    GuildWidgetStyle,
    Routes,
} from "discord-api-types/v10"
import express, { Application } from "express"
import * as deepAi from "deepai"

deepAi.default.setToken(process.env.DEEPAI)

const management = "958566416691367937"

const app: Application = express()
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN)

console.log(`Started`)

app.get("/", (req, res) => {
    res.sendStatus(200)
})

app.get("/status/:id", async (req, res) => {
    const { id } = req.params

    const user = (await rest.get(Routes.user(id))) as APIUser
    if (!user) return res.sendStatus(404)

    const widget = (await rest.get(
        Routes.guildWidgetJSON(management)
    )) as APIGuildWidget
    if (!widget) return res.sendStatus(500)

    console.log(widget, user)

    const found = widget.members.filter((x) => x.username === user.username)
    let result
    await Promise.all(
        result = found.map(async (x) => {
            return await deepAi.default.callStandardApi("image-similarity", {
                image1: x.avatar_url,
                image2: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=1024`,
            })
        })
    )
    console.log(found, result)
    if (found) return res.json(found)

    return res.sendStatus(503)
})
app.listen(8080)
