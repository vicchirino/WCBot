import { sleep } from "./utils"
import { SerieA } from "./api/leaguesAPI"
import {
  areMatchesToPost,
  postReadyToStartMatches,
  postEventsOfMatch,
} from "./domain/match"
import { TournamentStore } from "./model/TournamentStore"
import { Match } from "./model/Match"
import { getFixturesFromLeague } from "./api/fixturesAPI"

async function main() {
  console.log(
    "-------------------------- Program start --------------------------\n"
  )
  let fixtureItems = await getFixturesFromLeague(SerieA, "2022")
  let matches = fixtureItems.map(fixtureItem => new Match(fixtureItem))
  let today = new Date()

  console.log(`--- Today is: ${today.toDateString()}\n`)
  console.log(`--- League: WorldCup.\n`)
  console.log(`--- Matches: ${matches.length}.\n`)

  const tournamentStore = TournamentStore.getInstance()
  tournamentStore.setMatches(matches)

  while (true) {
    if (today.getDay() !== new Date().getDay()) {
      console.log(
        "-------------------------- New day! --------------------------\n"
      )
      today = new Date()
      fixtureItems = await getFixturesFromLeague(SerieA, "2022")
      let matches = fixtureItems.map(fixtureItem => new Match(fixtureItem))
      console.log(`--- Today is: ${today.toDateString()}\n`)
      console.log(`--- Matches: ${matches.length}.\n`)
      tournamentStore.setMatches(matches)
    }

    if (areMatchesToPost(tournamentStore.matchesFromToday)) {
      console.log(
        "-------------------------- Matches ready to post! --------------------------\n"
      )
      // Post Matches ready to start
      let matchesNearToStartNotPosted =
        tournamentStore.getMatchesNearToStartNotPosted()
      if (matchesNearToStartNotPosted.length > 0) {
        console.log(
          "-------------------------- Post Matches near to start --------------------------\n"
        )
        console.log(
          `--- Matches near to start: ${matchesNearToStartNotPosted.length}.\n`
        )
        postReadyToStartMatches(matchesNearToStartNotPosted)
        tournamentStore.setMatchesNearToStartPosted()
      }

      // Post events of matches live
      let liveMatchesNotPosted = tournamentStore.getLiveMatchesNotPosted()
      if (liveMatchesNotPosted.length > 0) {
        console.log(
          "-------------------------- Post events of live matches --------------------------\n"
        )
        console.log(`--- Matches live: ${liveMatchesNotPosted.length}.\n`)
        for (const index in liveMatchesNotPosted) {
          postEventsOfMatch(liveMatchesNotPosted[index])
        }
        tournamentStore.setLiveMatchesPosted()
      }
      await sleep(60 * 1000)
    } else {
      console.log(
        "-------------------------- No more matches today! --------------------------\n"
      )
    }
  }
}

main()
