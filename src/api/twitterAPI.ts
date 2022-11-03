import { TwitterApi } from "twitter-api-v2"
import { sleep } from "../utils"
require("dotenv").config()

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY || "",
  appSecret: process.env.TWITTER_API_KEY_SECRET || "",
  accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY || "",
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || "",
})

export async function postTweet(text: string) {
  return twitterClient.v2
    .tweet(text)
    .then(res => {
      console.log("RESPONSE: ", res)
    })
    .catch(err => {
      console.log("ERROR: ", err)
    })
}

export async function postTweets(tweets: string[]) {
  for (const tweet of tweets) {
    console.log("## Post tweet:")
    console.log(tweet)
    // postTweet(tweet)
    console.log("-----")
    await sleep(15 * 1000)
  }
}
