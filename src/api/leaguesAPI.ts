import { LeagueResponse } from "../utils/types"
import { getRequest } from "./utils"

export const WorldCupID = 1
export const ChampionsLeagueID = 2
export const EuropaLeagueID = 3
export const LaLiga = 140
export const SerieA = 135
export const FACup = 45

export async function getLeague(leagueID: number) {
  const result = await getRequest<LeagueResponse>("leagues", { id: leagueID })
  return result.response
}
