# the-floob-experiment

https://floob.ocean.lol

## setup

1. `npm ci`
1. create `server/cfg.json`, paste the following JSON, and edit it to your needs
    ```json
    {
        "port": 8656,
        "host": "http://127.0.0.1:8656",
        "identificatorHost": "https://id.ocean.lol",
        "secret": "someRandomString",
        "dev": false
    }
    ```
    **options:**
    `port`: the port to run the server from
    `host`: the root URL of the site that users will access this from
    `identificatorHost`: the root URL of your identificator server (leave this as is if you don't have/want one)
    `secret`: some random, unguessable string
    `dev`: read on
1. `npx sequelize-cli db:migrate`

### for actual use
4. make sure the `dev` option in `server/cfg.json` is `false`
1. `npm run build`
1. `npm start`


### for development
4. make sure the `dev` option in `server/cfg.json` is `true`
1. `npm run dev-client`
1. in a separate terminal, run `nodemon server`
1. access from http://127.0.0.1:8656 (replace 8656 with whatever port your server is running from)
- sometimes chrome doesnt like to set cookies from localhost. if this becomes a problem, try replacing the `127.0.0.1` or `localhost` in `host` in `server/cfg.json` with `[*.]fuf.me` or any other domain which points to localhost (e.g. `"host": "http://fuf.me:8656",`)