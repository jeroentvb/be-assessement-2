# Project tech
This is a repo for my dating website for project tech.
It's built using the express framework for nodejs.

## How to use
1. Run `npm install` & `npm build`.
2. Create a `.env` file containing the following:
```
DB_HOST=localhost
DB_USER=root
DB_NAME=datingsite
DB_PASSWORD= YOUR DATABASE PASSWORD
SESSION_SECRET= YOUR 'SECRET' express sessions
```
3. Uncomment the `createDb` & `addUsr` functions, as well as `.get('/createdb', createDb)` & `.get('/addusr', addUsr)`
4. Host a mysql server (I used xampp on windows)
5. Run the server by navigating to the folder in the command line and either running `nodemon` or `npm start` (I reccommend nodemon as it restarts the server after saving a change in index.js)
5. Open your browser and go to `localhost:3000/createdb`. If everything is configured correctly you will see __'Database created'__ in the console.
6. Go to `localhost:300/addusr`. If everything is configured correctly you will see __'Table created'__ in the console. The database has now been set up.
7. Comment (or remove) the`createDb` & `addUsr` functions as well as `.get('/createdb', createDb)` & `.get('/addusr', addUsr)`.
8. You now need to populate the database. You can do this using `localhost:3000/register` or do it manually.
