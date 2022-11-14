import { startBotForLeague } from "./app"
import dotenv from "dotenv"
dotenv.config()

startBotForLeague(+(process.env.BOT_LEAGUE_ID || 0))
