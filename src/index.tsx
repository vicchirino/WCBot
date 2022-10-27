import { FixtureResponse, FixtureItem, MatchEvent } from "./utils/types"
import { sleep } from "./utils"
import elFixtures from "./utils/mocks/europa_league_response.json"
import { postTweet } from "./api/twitterAPI"
import { getFixtures } from "./api/fixturesAPI"

async function postTweets(tweets: string[]) {
  for (const tweet of tweets) {
    console.log("## Post tweet:")
    console.log(tweet)
    // postTweet(tweet)
    console.log("-----")
    await sleep(5000)
  }
}

function getTweetTextForFixtureEvent(
  fixtureItem: FixtureItem,
  event: MatchEvent
): string {
  if (event.type === "Goal") {
    if (event.detail === "Penalty") {
      return `➡️  Penalty scored!!\n\n⚽ ${event.player.name} - ${event.team.name}\n\n⏰ ${fixtureItem.fixture.status.elapsed}min ${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${fixtureItem.goals.away} ${fixtureItem.teams.away.name}`
    }
    if (event.detail === "Own Goal") {
      return `➡️  Own Goal\n\n⚽${event.player.name} - ${event.team.name}\n\n⏰ ${fixtureItem.fixture.status.elapsed}min ${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${fixtureItem.goals.away} ${fixtureItem.teams.away.name}`
    }
    if (event.detail === "Normal Goal") {
      return `➡️  Goal\n\n⚽ ${event.player.name} - ${event.team.name}\n${
        event.assist.name ? `👥 ${event.assist.name}` : ""
      }\n${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${
        fixtureItem.goals.away
      } ${fixtureItem.teams.away.name}\n⏰ ${
        fixtureItem.fixture.status.elapsed
      }min`
    }
    if (event.detail === "Missed Penalty") {
      return `➡️ Missed Penalty\n❌${event.player.name}\n\n⏰ ${fixtureItem.fixture.status.elapsed}min ${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${fixtureItem.goals.away} ${fixtureItem.teams.away.name}`
    }
  }
  if (event.type === "Card") {
    if (event.detail === "Yellow Card") {
      return `${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${fixtureItem.goals.away} ${fixtureItem.teams.away.name}\n🟡 ${event.player.name} - ${event.team.name} \n⏰ ${fixtureItem.fixture.status.elapsed}min`
    }
    if (event.detail === "Second Yellow card") {
      return `${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${fixtureItem.goals.away} ${fixtureItem.teams.away.name}\n🟡🟡 ${event.player.name} - ${event.team.name} \n⏰ ${fixtureItem.fixture.status.elapsed}min`
    }
    if (event.detail === "Red Card") {
      return `${fixtureItem.teams.home.name} ${fixtureItem.goals.home} - ${fixtureItem.goals.away} ${fixtureItem.teams.away.name}\n🔴 ${event.player.name} - ${event.team.name} \n⏰ ${fixtureItem.fixture.status.elapsed}min`
    }
  }
  return ""
}

async function main() {
  // Get fixtures
  // const worldCupFixtures = await getFixtures({
  //   league: WorldCupID,
  //   season: "2022",
  // })

  const fixtureItems: FixtureResponse["response"] = elFixtures.response

  while (true) {
    const fixtureInPast: FixtureResponse["response"] = []
    const fixtureInFuture: FixtureResponse["response"] = []
    const fixturesLive: FixtureResponse["response"] = []
    const fixturesToStart: FixtureResponse["response"] = []

    const today = new Date("2022-10-27T19:00:00+00:00")

    fixtureItems.forEach(fixtureItem => {
      const fixtureDate = new Date(fixtureItem.fixture.date as string)
      if (today <= fixtureDate) {
        // Add to fixtures in the future
        fixtureInFuture.push(fixtureItem)

        // Add to fixtures to start
        const minutes = 45 * 60 * 1000 // 45 minutes
        const nearToStartDate = new Date(fixtureDate.getTime() - minutes)
        if (nearToStartDate <= today) {
          fixturesToStart.push(fixtureItem)
        }
      } else {
        fixtureInPast.push(fixtureItem)
        if (
          fixtureItem.fixture.status.short === "LIVE" ||
          fixtureItem.fixture.status.short === "1H" ||
          fixtureItem.fixture.status.short === "2H" ||
          fixtureItem.fixture.status.short === "HT" ||
          fixtureItem.fixture.status.short === "ET" ||
          fixtureItem.fixture.status.short === "P"
        ) {
          // Add to live fixtures
          fixturesLive.push(fixtureItem)
        }
      }
    })

    // console.log("### Fixture in the past", fixtureInPast.length)
    console.log("### Fixture To Start", fixturesToStart.length)
    console.log("### Fixture Live", fixturesLive.length)
    // console.log("### Fixture in the future", fixtureInFuture.length)

    // Post tweets for fixtures to start
    postTweets(
      fixturesToStart.map(
        fixtureItem =>
          `⚽️ ${fixtureItem.teams.home.name} vs ${fixtureItem.teams.away.name} is about to start!`
      )
    )

    // Get live fixtures and post events on twitter
    getFixtures({
      live: "all",
    }).then(fixtureItems => {
      // fixtureItems.filter(fixtureItem => fixturesLive.includes(fixtureItem))
      fixtureItems.forEach(fixtureItem => {
        if (!fixtureItem.events) return
        console.log(
          "### Fixture:",
          fixtureItem.teams.home.name,
          "-",
          fixtureItem.teams.away.name
        )
        postTweets(
          fixtureItem.events.map(event =>
            getTweetTextForFixtureEvent(fixtureItem, event)
          )
        )
      })
    })

    await sleep(60000)
  }
}

main()
