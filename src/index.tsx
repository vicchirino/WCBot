import { startBotForLeague } from "./app"
require("dotenv").config()

startBotForLeague(+(process.env.BOT_LEAGUE_ID || 0))
