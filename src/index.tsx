import { FixtureItem, FixtureResponse, MatchEvent } from "./utils/types"
import { sleep } from "./utils"
import { ChampionsLeagueID } from "./api/leaguesAPI"
import {
  getFixturesFromLeague,
  isFixtureNearToStart,
  compareFixtureDates,
  postReadyToStartFixtures,
  postEventsOfFixture,
  isFixtureInThePast,
  isFixtureLive,
} from "./domain/fixture"
import liveFixturesMock from "./utils/mocks/fixtures_response.json"

async function main() {
  let fixtureItems = await getFixturesFromLeague(ChampionsLeagueID, "2022")
  fixtureItems.sort((itemA, itemB) => compareFixtureDates(itemA, itemB))
  console.log("#### Fixtures from League", fixtureItems.length)
  console.log("----------------------------------\n")
  let fixturesLive: FixtureItem[] = []
  let fixturesLivePosted: FixtureItem[] = []
  let fixturesNearToStart: FixtureItem[] = []
  let fixturesNearToStartPosted: FixtureItem[] = []
  let nearestFixture: FixtureItem | undefined = fixtureItems && fixtureItems[0]

  while (true) {
    if (isFixtureInThePast(nearestFixture)) {
      fixtureItems = await getFixturesFromLeague(ChampionsLeagueID, "2022")
      fixtureItems.sort((itemA, itemB) => compareFixtureDates(itemA, itemB))
      nearestFixture = fixtureItems && fixtureItems[0]
    }
    console.log("#### Fixtures from League sorted", fixtureItems.length)
    console.log("----------------------------------\n")
    console.log(
      "#### Fixtures near to start posted",
      fixturesNearToStartPosted.length
    )
    console.log("----------------------------------\n")
    console.log("#### Fixtures live posted", fixturesLivePosted.length)
    console.log("----------------------------------\n")

    const minutes = 15 * 60 * 1000
    fixturesNearToStart = fixtureItems.filter(
      fixtureItem =>
        isFixtureNearToStart(fixtureItem, minutes) &&
        !fixturesNearToStartPosted.includes(fixtureItem)
    )

    console.log("#### Fixtures near to start", fixturesNearToStart.length)
    console.log("----------------------------------\n")

    // Si hay partidos por empezar posteo el tweet
    if (fixturesNearToStart.length > 0) {
      fixturesNearToStartPosted = [
        ...fixturesNearToStartPosted,
        ...fixturesNearToStart,
      ]
      console.log(
        "#### Fixtures near to start posted",
        fixturesNearToStartPosted.length
      )
      console.log("----------------------------------\n")
      postReadyToStartFixtures(fixturesNearToStart)
    }

    fixturesLive = fixtureItems.filter(
      fixtureItem =>
        isFixtureLive(fixtureItem) && !fixturesLivePosted.includes(fixtureItem)
    )
    // fixturesLive = liveFixturesMock.response as FixtureItem[]
    console.log("#### Fixtures Live", fixturesLive.length)
    console.log("----------------------------------\n")

    // Si hay partidos en vivo posteo los events
    if (fixturesLive.length > 0) {
      fixturesLivePosted = [...fixturesLivePosted, ...fixturesLive]
      console.log("#### Fixtures Live Posted", fixturesLivePosted.length)
      console.log("----------------------------------\n")
      for (const key in fixturesLive) {
        postEventsOfFixture(fixturesLive[key])
      }
    }
    await sleep(100000)
  }
}

main()
