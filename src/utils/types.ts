export type Fixture = {
  id: number
  referee: string | null
  timezone: string
  date: string
  timestamp: number
  venue: Venue
  status: {
    long: string | null
    short: string | null
    elapsed: number | null
  }
}

type Venue = {
  name: string
  city: string
}

type League = {
  id: number
  name: string
  country: string
  logo: string
  flag: string | null
  season: number | null
  round: string | null
}

export type Team = {
  id: number
  name: string
  logo: string
}

type Score = {
  halftime: {
    home: number | null
    away: number | null
  }
  fulltime: {
    home: number | null
    away: number | null
  }
  extratime: {
    home: number | null
    away: number | null
  }
  penalty: {
    home: number | null
    away: number | null
  }
}

type Player = {
  id: number
  name: string
}

type Coverage = {
  fixtures: {
    events: Boolean
    lineups: Boolean
    statistics_fixtures: Boolean
    statistics_players: Boolean
  }
  standings: Boolean
  players: Boolean
  top_scorers: Boolean
  top_assists: Boolean
  top_cards: Boolean
  injuries: Boolean
  predictions: Boolean
  odds: Boolean
}

type Season = {
  year: number
  start: string
  end: string
  current: Boolean
  coverage: Coverage
}

export enum MatchEventType {
  Goal,
  Card,
  Subst,
  Var,
}

export type MatchEventWithId = {
  id: number
} & MatchEvent

export type MatchEvent = {
  time: {
    elapsed: number
    extra: number | null
  }
  team: Team
  player: Player
  assist: {
    id: number | null
    name: string | null
  }
  type: "Goal" | "Card" | "subst" | "Var"
  detail:
    | "Normal Goal"
    | "Penalty"
    | "Own Goal"
    | "Yellow Card"
    | "Red Card"
    | "Missed Penalty"
    | "Goal cancelled"
    | "Penalty confirmed"
    | "Second Yellow card"
    | "Substitution 1"
    | "Substitution 2"
    | "Substitution 3"
    | "Substitution 4"
    | "Substitution 5"
    | "Substitution 6"

  // comments: string | null;
}

type Country = {
  name: string
  code: string
  flag: string
}

export type FixtureItem = {
  fixture: Fixture
  league: League
  teams: {
    home: Team
    away: Team
  }
  goals: {
    home: number | null
    away: number | null
  }
  score: Score
  events?: MatchEvent[]
}

type LeagueItem = {
  league: League
  country: Country
  seasons: Season[]
}

type DefaultResponse = {
  errors: {
    token: string | null
  } | null
  results: number
  paging: {
    current: number
    total: number
  }
}

export type FixtureResponse = {
  response: FixtureItem[]
} & DefaultResponse

export type EventResponse = {
  response: MatchEvent[]
} & DefaultResponse

export type LeagueResponse = {
  response: LeagueItem[]
} & DefaultResponse
