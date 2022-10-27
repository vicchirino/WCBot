import { TwitterApi } from "twitter-api-v2"
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
