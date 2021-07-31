# node-jwt-auth
node-jwt-auth is node.js web api using express.js and mongodb. It uses Jwt access token and refresh token for authentication and authorization.

run `npm install`to get all the npm packeges then you can use `npm run dev` to run the application. There is a postman file in root directory to discribe the apis.

### access token
Use this token for authentication and authorization. Because if anyone who has this token has this user permisions so that token must has a short period life.

### refresh token
I have saved these tokens in database and they have no expiration time and they are get deleted when user logs out. They are used to generate new access tokens using the `/get-token` route.
When a user forger to logout we need to have a solution to expire the tokens so we have `refreshTokenLastUse` field in User model to control it.
If user does not use the token to get an access token for a while(10 min in our case) then that refresh token is supposed as expired.
