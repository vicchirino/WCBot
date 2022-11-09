import { sleep } from "../utils"
import { postTweets } from "../api/twitterAPI"
import { TournamentStore } from "../model/TournamentStore"
import { Match } from "../model/Match"
import { getLiveFixture } from "../api/fixturesAPI"

// Match domain helper functions

/**
 * If now is between the first and last match of the day, there are live fixtures.
 * first: firstMatchOfTheDayDate - 20 minutes
 * last: lastMatchOfTheDayDate + 120 minutes
 */

export function areMatchesToPost(match: Match[]): boolean {
  const now = new Date()
  const estimatedMatchDuration = 120 * 60 * 1000 // 120 minutes
  const nearToStartEstimatedTime = 20 * 60 * 1000 // 20 minutes
  if (match.length === 0) {
    return false
  }
  const sortedFixtureItems = match.sort((itemA, itemB) =>
    compareMatchDates(itemA, itemB)
  )
  const firstMatchOfTheDay = sortedFixtureItems[0]
  const firstMatchDateWithMargin = new Date(
    firstMatchOfTheDay.fixtureDate().getTime() - nearToStartEstimatedTime
  )
  if (sortedFixtureItems.length === 1) {
    const firstMatchEstimatedEndDate = new Date(
      firstMatchOfTheDay.fixtureDate().getTime() + estimatedMatchDuration
    )
    now > firstMatchDateWithMargin && now < firstMatchEstimatedEndDate
  }

  const lastMatchOfTheDay = sortedFixtureItems[sortedFixtureItems.length - 1]

  const lastMatchDateWithMargin = new Date(
    lastMatchOfTheDay.fixtureDate().getTime() + estimatedMatchDuration
  )

  return now > firstMatchDateWithMargin && now < lastMatchDateWithMargin
}

export function compareMatchDates(matchA: Match, matchB: Match): number {
  return +matchA.fixtureDate() - +matchB.fixtureDate()
}

// Twitter API helper functions

export async function postEventsOfMatch(match: Match) {
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
    liveMatch = updatedMatch ? new Match(updatedMatch) : liveMatch

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
      await postTweets(
        matchEvents.map(matchEvent =>
          liveMatch.getTweetTextForEvent(matchEvent)
        )
      )
      tournamentStore.setLiveMatchesEventsPosted(liveFixtureId)
    } else {
      console.log(
        `-------------------------- No new event for this match ${liveFixtureId} --------------------------\n`
      )
    }
    await sleep(60 * 1000)
  }
  console.log("End no more live")
}

export function postReadyToStartMatches(matches: Match[]) {
  postTweets(
    matches.map(
      match =>
        `⚽️ ${match.teams().home.name} vs ${
          match.teams().away.name
        } is about to start!`
    )
  )
}
