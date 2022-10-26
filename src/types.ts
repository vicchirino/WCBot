type Fixture = {
  id: Number
  referee: String
  timezone: String
  date: String
  timestamp: Number
  status: {
    long: String
    short: String
    elapsed: Number
  }
}

type League = {
  id: Number
  name: String
  country: String
  logo: String
  flag: String
  season: Number
  round: String
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

enum MatchEventType {
  Goal,
  Card,
  Subst,
  Var,
}

type MatchEvent = {
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
  type: MatchEventType
  detail: String
  // comments: String | null;
}

type FixtureItem = {
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
  events: MatchEvent[]
}

export type FixtureResponse = {
  results: Number
  errors: {
    token: String | null
  } | null
  paging: {
    current: Number
    total: Number
  }
  response: FixtureItem[]
}
