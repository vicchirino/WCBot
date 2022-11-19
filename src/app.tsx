import { sleep } from "./utils"
import {
  areMatchesToPost,
  postEventsOfMatch,
  postMatchFinished,
  postMatchStarted,
  postReadyToStartMatches,
  postPollsMatches,
} from "./domain/match"
import { TournamentStore } from "./model/TournamentStore"
import { Match } from "./model/Match"
import {
  getFixture,
  getFixturesFromLeague,
  getLiveFixture,
} from "./api/fixturesAPI"

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
      const finishedMatch = await getFixture(liveMatch.fixtureId())
      if (finishedMatch && new Match(finishedMatch).isFixtureFinished()) {
        console.log(
          `-------------------------- Match finished ${liveFixtureId} --------------------------\n`
        )
        postMatchFinished(liveMatch)
        break
      }
      continue
    }
    liveMatch = new Match(updatedMatch)

    tournamentStore.setLiveMatchesEvents(
      liveMatch.fixtureId(),
      liveMatch.matchEvents()
    )
    const matchEvents = tournamentStore.getLiveMatchesEventsNotPosted(
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

export async function startBotForLeague(leagueId: number) {
  console.log(
    "-------------------------- Program start --------------------------\n"
  )
  let fixtureItems =
    (await getFixturesFromLeague(
      leagueId,
      new Date().getFullYear().toString()
    )) || []
  const matches = fixtureItems.map(fixtureItem => new Match(fixtureItem))
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
      fixtureItems =
        (await getFixturesFromLeague(
          leagueId,
          new Date().getFullYear().toString()
        )) || []
      const matches = fixtureItems.map(fixtureItem => new Match(fixtureItem))
      console.log(`--- Today is: ${today.toDateString()}\n`)
      tournamentStore.setMatches(matches)
      console.log(`--- Matches: ${tournamentStore.matchesFromToday.length}.\n`)
    }

    if (areMatchesToPost(tournamentStore.matchesFromToday)) {
      console.log(
        "-------------------------- Matches ready to post! --------------------------\n"
      )
      // Post Matches polls
      const matchesPollsNotPosted = tournamentStore.getMatchesPollsNotPosted()
      if (matchesPollsNotPosted.length > 0) {
        console.log(
          "-------------------------- Post Matches polls --------------------------\n"
        )
        console.log(
          `--- Matches near to start: ${matchesPollsNotPosted.length}.\n`
        )
        postPollsMatches(matchesPollsNotPosted)
        tournamentStore.setMatchesPollsPosted()
      }
      // Post Matches ready to start
      const matchesNearToStartNotPosted =
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
      const liveMatchesNotPosted = tournamentStore.getLiveMatchesNotPosted()
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
      await sleep(600 * 1000)
    }
  }
}
