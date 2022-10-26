import { TwitterApi } from "twitter-api-v2"

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY || "",
  appSecret: process.env.TWITTER_API_KEY_SECRET || "",
  accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY || "",
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || "",
})

export async function postTweet() {
  const response = await twitterClient.v2
    .tweet("Hello world! 2")
    .then(res => {
      console.log("RESPONSE: ", res)
    })
    .catch(err => {
      console.log("ERROR: ", err)
    })
}
