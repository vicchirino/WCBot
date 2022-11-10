import { postTweet, postTweets } from "../api/twitterAPI"
import { Match } from "../model/Match"
import { MatchEventWithId } from "../utils/types"

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

export async function postEventsOfMatch(
  match: Match,
  matchEvents: MatchEventWithId[]
) {
  await postTweets(
    matchEvents.map(matchEvent => match.getTextForEvent(matchEvent))
  )
}

export function postReadyToStartMatches(matches: Match[]) {
  postTweets(matches.map(match => match.getTextForReadyToStart()))
}

export function postMatchFinished(match: Match) {
  postTweet(match.getTextForFinished())
}

export function postMatchStarted(matches: Match[]) {
  postTweets(matches.map(match => match.getTextForStarted()))
}