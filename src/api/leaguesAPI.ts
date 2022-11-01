import { LeagueResponse } from "../utils/types"
import { getRequest } from "./utils"

export const WorldCupID = 1
export const ChampionsLeagueID = 2

export async function getLeague(leagueID: number) {
  const result = await getRequest<LeagueResponse>("leagues", { id: leagueID })
  result.response.map(leagueItem => {
    console.log(`## ${leagueItem.league.name} - ${leagueItem.country.name}`)
  })
}
