export type Fixture = {
  id: Number
  referee: String | null
  timezone: String
  date: String
  timestamp: Number
  status: {
    long: String | null
    short: String | null
    elapsed: Number | null
  }
}

type League = {
  id: Number
  name: String
  country: String
  logo: String
  flag: String | null
  season: Number | null
  round: String | null
}

type Team = {
  id: Number
  name: String
  logo: String
}

type Score = {
  halftime: {
    home: Number | null
    away: Number | null
  }
  fulltime: {
    home: Number | null
    away: Number | null
  }
  extratime: {
    home: Number | null
    away: Number | null
  }
  penalty: {
    home: Number | null
    away: Number | null
  }
}

type Player = {
  id: Number
  name: String
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
  year: Number
  start: String
  end: String
  current: Boolean
  coverage: Coverage
}

export enum MatchEventType {
  Goal,
  Card,
  Subst,
  Var,
}

export type MatchEvent = {
  time: {
    elapsed: Number
    // extra: Number | null;
  }
  team: Team
  player: Player
  assist: {
    id: Number | null
    name: String | null
  }
  type: "Goal" | "Card" | "Subst" | "Var"
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
  // comments: String | null;
}

type Country = {
  name: String
  code: String
  flag: String
}

export type FixtureItem = {
  fixture: Fixture
  league: League
  teams: {
    home: Team
    away: Team
  }
  goals: {
    home: Number | null
    away: Number | null
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
    token: String | null
  } | null
  results: Number
  paging: {
    current: Number
    total: Number
  }
}

export type FixtureResponse = {
  response: FixtureItem[]
} & DefaultResponse

export type LeagueResponse = {
  response: LeagueItem[]
} & DefaultResponse
