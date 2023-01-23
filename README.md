# Arithmetic Expression Calculator

Rest Api service created on nodejs, user register and login using mongodb (Using mongoose module) as database
and jwt as auth method, token expires after 10 minutes of being generated or after 5 
operations request, being blacklisted on database (Cleans all expired tokens on DB every 8 minutes).

A proxy server is also implemented for request controlling purposes.

It also uses a WebSocket server to control and response client's requests. (Will implement a job queue hopefully soon).

Finally jison lexical parser is used to parse and validate arithmetic expressions.

## Install dependencies
```
npm install
```

## Environment Variables

To run this project, you will need to have some environment variables on your .env file.

Check `.env.example` to get started.

Your cant simply rename `.env.example` file to `.env` and fill it with your things.
