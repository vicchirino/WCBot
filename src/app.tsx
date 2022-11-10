import { sleep } from "./utils"
import { SerieA } from "./api/leaguesAPI"
import {
  areMatchesToPost,
  postEventsOfMatch,
  postMatchFinished,
  postMatchStarted,
  postReadyToStartMatches,
} from "./domain/match"
import { TournamentStore } from "./model/TournamentStore"
import { Match } from "./model/Match"
import { getFixturesFromLeague, getLiveFixture } from "./api/fixturesAPI"

export async function processMatchEvents(match: Match) {
  let liveMatch = match
  const tournamentStore = TournamentStore.getInstance()
  const liveFixtureId = liveMatch.fixtureId()

  while (liveMatch.isFixtureLive()) {
    console.log(
      `-------------------------- Match live ${liveFixtureId} --------------------------\n`
    )
    const updatedMatch = await getLiveFixture(
      liveMatch.fixtureId(),
      liveMatch.leagueId()
    )
    if (!updatedMatch) {
      console.log(
        `-------------------------- Match finished ${liveFixtureId} --------------------------\n`
      )
      postMatchFinished(liveMatch)
      break
    }
    liveMatch = new Match(updatedMatch)

    tournamentStore.setLiveMatchesEvents(
      liveMatch.fixtureId(),
      liveMatch.matchEvents()
    )
    let matchEvents = tournamentStore.getLiveMatchesEventsNotPosted(
      liveMatch.fixtureId()
    )
    if (matchEvents.length > 0) {
      console.log(
        `-------------------------- Post match events ${liveFixtureId} --------------------------\n`
      )
      console.log(`--- Match events: ${matchEvents.length}.\n`)
      await postEventsOfMatch(liveMatch, matchEvents)
      tournamentStore.setLiveMatchesEventsPosted(liveFixtureId)
    } else {
      console.log(
        `-------------------------- No new event for this match ${liveFixtureId} --------------------------\n`
      )
    }
    await sleep(60 * 1000)
  }
}

export async function main() {
  console.log(
    "-------------------------- Program start --------------------------\n"
  )
  let fixtureItems = (await getFixturesFromLeague(SerieA, "2022")) || []
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
      fixtureItems = (await getFixturesFromLeague(SerieA, "2022")) || []
      let matches = fixtureItems.map(fixtureItem => new Match(fixtureItem))
      console.log(`--- Today is: ${today.toDateString()}\n`)
      tournamentStore.setMatches(matches)
      console.log(`--- Matches: ${tournamentStore.matchesFromToday.length}.\n`)
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
        postMatchStarted(liveMatchesNotPosted)
        for (const index in liveMatchesNotPosted) {
          processMatchEvents(liveMatchesNotPosted[index])
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
