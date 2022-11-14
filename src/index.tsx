import { postTweetWithPoll } from "./api/twitterAPI"
import { startBotForLeague } from "./app"
require("dotenv").config()

startBotForLeague(+(process.env.BOT_LEAGUE_ID || 0))

// postTweetWithPoll(
//   "Costa Rica vs Netherlands\n\n⏰ 12:00hs\n\nWho's going to win?\n\n#FIFAWorldCup 🏆⚽️",
//   ["Costa Rica 🇨🇷", "Netherlands 🇳🇱", "Draw"]
// )
