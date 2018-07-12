# MeanStackDemo

prereqs:
- nodejs 8+
- a mongo db instance (try mongodb atlas for fast cloud hosted db)
- supply environment variable for db connection
- you can do this by creating nodemon.json:

{
  "env": {
    "MONGO_DB_CONNECTION" : "Your Connection String"
  }
}


run:
- npm install
- npm run start-server
- ng serve for Angular UI
- browse to localhost:3000 for server or localhost:4200 for UI
- ????
- profit
