import { LeagueResponse } from "../utils/types"
import { getRequest } from "./utils"

const WorldCupID = 1

export async function getLeagues() {
  const result = await getRequest<LeagueResponse>("leagues", { id: WorldCupID })
  result.response.map(leagueItem => {
    console.log(`## ${leagueItem.league.name} - ${leagueItem.country.name}`)
  })
}
