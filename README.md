## Footbal Notifications bot

This is a bot that sends notifications about football matches to Twitter.

### Notifications

- When a match is about to start
- When a match starts
- Match events:
  - Goals
  - Yellow/Red cards
  - Substitutions
- When a match ends

### Setup

For getting this bot running locally you need to have a few things:

- Create an account on [API-Football](https://www.api-football.com/) and get an API key and URL.
- A Twitter account and a Twitter app. You can get them [here](https://developer.twitter.com). You need to get the API key, API secret key, Access token and Access token secret.
- Select the league from which you want to get the matches. You can find the league ID [here](https://dashboard.api-football.com/soccer/ids).
- Setup all the mentioned values in an environment file. You can use the `.env.example` file as a template.
- Install the dependencies with `yarn` or `npm install`.

### Run

The app start running `yarn start` or `npm start`.
The app will make 1 request for getting the matches and 1 request per minute for each live match.

### Tests

You can run the tests with `yarn test` or `npm test`.

### Built with

- [API-Football](https://www.api-football.com)
- [Typescript](https://www.typescriptlang.org)
- [Twitter API](https://github.com/plhery/node-twitter-api-v2#readme)
- [Axios](https://axios-http.com/docs/intro)
