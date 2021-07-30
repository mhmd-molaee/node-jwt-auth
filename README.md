# node-jwt-auth
node-jwt-auth is node.js web api using express.js and mongodb. It uses Jwt access token and refresh token for authentication and authorization.

run `npm install`to get all the npm packeges then you can use `npm run dev` to run the application. There is a postman file in root directory to discribe the apis.

### access token
Use this token for authentication and authorization. Because if anyone who has this token has this user permisions so that token must has a short period life.

### refresh token
These tokens are saved in database and they have no expiration time
