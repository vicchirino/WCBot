import { FixtureResponse } from "./src/types"
import { postRequest } from "./src/api"
import { postTweet } from "./src/api/twitterAPI"

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET
const TWITTER_ACCESS_TOKEN_KEY = process.env.TWITTER_ACCESS_TOKEN_KEY
const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET
const TWITTER_BOT_ID = process.env.TWITTER_BOT_ID

/**
 * - If there is new event, post it to twitter.
 * - Posting to twitter function.
 *
 * I need to save the last event (minutes) of each match to not post the same event twice.
 *
 */

async function getFixtures() {
  console.log("GET FIXTURES CALLED")
  const result = await postRequest<FixtureResponse>("fixtures", { live: "all" })
  result.response.map(match => {
    console.log(
      `## ${match.fixture.id} ${match.league.name}: ${match.teams.home.name} ${match.goals.home}-${match.goals.away} ${match.teams.away.name} - ${match.fixture.status.elapsed} min`
    )
    match.events
      .sort((eventA, eventB) =>
        eventA.time.elapsed <= eventB.time.elapsed ? 1 : 0
      )
      .map(event => {
        console.log(`-> ## ${event.time.elapsed} min:  ${event.detail}`)
        console.log(`   --> # ${event.player.name} - ${event.team.name}`)
        console.log(`   --> # ${event.assist.name}`)
      })
  })
  // postTweet()
}

getFixtures()
