# Project tech
This is a my prototype for my dating website for project tech. It's called 'WatchTogether'
It's built using the `express` framework for `nodejs`. Pages are rendered using `ejs`.

Users can sign up using name, email and password; select 2 of their favorite series; select matching preferences.
Tagline, avatar, and password can be changed (if logged in), on the settings page (`localhost:3000/settings`). An account can also be deleted from there (password verification is needed).
Everything is stored in the database and passwords are hashed with salt.

## How to use
0. Make sure you have `node` and `npm` installed.
1. Run `npm install` & `npm build`.
2. Create a `.env` file containing the following:
```
DB_HOST=localhost
DB_USER=root
DB_NAME=datingsite
DB_PASSWORD= YOUR DATABASE PASSWORD
SESSION_SECRET= YOUR express sessions 'SECRET'
```
3. Uncomment the `createDb` function, as well as `.get('/createdb', createDb)`.
4. Comment `database: process.env.DB_NAME`.
5. Host a mysql server (I used xampp on windows).
6. Run the server by navigating to the folder in the command line and either running `nodemon` or `npm start` (I reccommend nodemon as it restarts the server after saving a change in server.js).
7. Open your browser and go to `localhost:3000/createdb`. If everything is configured correctly you will see __'Database created'__ in the console.
8. Comment (or remove) the `createDb` function, as well as `.get('/createdb', createDb)` and uncomment `database: process.env.DB_NAME`.
9. Uncomment the `addUsr` function, as well as `.get('/addusr', addUsr)`.
10. Go to `localhost:3000/addusr`. If everything is configured correctly you will see __'Table created'__ in the console. The database has now been set up.
11. Comment (or remove) the `addUsr` function as well as `.get('/addusr', addUsr)`.
12. You now need to populate the database. You can do this using `localhost:3000/register` or do it manually in the database.
Changes to a profile can be made from `localhost:3000/settings` or directly in the database.

### Notes
* A lot of `console.log`'s have been commented because they are only useful for debugging.
