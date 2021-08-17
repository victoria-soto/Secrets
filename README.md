# Secrets

Similar to [Whisper](http://whisper.sh/), Secrets is a secret posting application.

The project demonstrates six levels of authentication and security using various [NPM](https://www.npmjs.com/) packages and OAuth 2.0 sign in with Google.

## Initial Set-up
Creates the app before any authentication/security measures implemented.

### Create package.json

```sh
$ npm init -y
```

### Install dependencies
```sh
$ npm i express ejs body-parser
```

### Startup MongoDB Server Locally
```sh
$ mongod
```

### Startup Mongo Shell Locally
```sh
$ mongo
```

## Level 1 - Username and Password
Contains a database of user accounts and stores newly created accounts using [Mongoose](https://mongoosejs.com/) and [mongoDB](https://www.mongodb.com/).

### NPM Package - Mongoose
```sh
$ npm i mongoose
```

### Registration

<img src="docs/register1.png"/><br/>

### Login

<img src="docs/login1.png"/><br/>

### Registration or Login Success
Upon successful registration or login, the user gets redirected to a page of secrets that other users have posted anonymously.

<img src="docs/registerSuccess.png"/><br/>

### MongoDB New User Added
Below is the Robo3T MongoDB GUI to help visualize the Secrets user database. The first user was registered under the email 1@2.com with a password of 123.

<img src="docs/Robo3T-NewUser1.png"/><br/>

Level 1 username and password creation only provides a very basic level of security as the user name and password is stored as plain text in the database.

## Level 2 - Encryption
The user database is encrypted using [mongoose-encryption](https://www.npmjs.com/package/mongoose-encryption) where a secret string defined used to encrypt the database.

### NPM Package - mongoose-encryption
```sh
$ npm i mongoose-encryption
```

A constant secret is defined in the app.js. The [mongoose-encryption](https://www.npmjs.com/package/mongoose-encryption) package gets added as a plugin to the mongoose userSchema defined where secret is passed over as an object along with an option to only encrypt the user passwords field.

```
const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

```
 When a new user is created upon registration, `save` is called and their password is encrypted. Upon user login, `find` is used on the document to locate the already existing user email in the database and decrypts their password.

The second user has an email of a@b.com with a password of qwerty, however, the user's password has been encrypted and cannot be seen in the database. Whereas the first user, 1@2.com, has their password, 123, stored as just plain text since their account was created at Level 1 security where no encryption was used.

<img src="docs/Robo3T-NewUser2.png"/><br/>

<img src="docs/Robo3T-NewUser2a.png"/><br/>

At its current state, if the secrets website is hacked, the app.js can be accessed where the secret string is stored and the same package, [mongoose-encryption](https://www.npmjs.com/package/mongoose-encryption), can be installed and used to decrypt the user's passwords in the database since the plain text version can be recovered.

Next level will involve the usage of environmental variables which helps store secrets like encryption keys and API keys.

## Level 3 - Hashing with md5

## Level 4 - Hashing and Salting with bcrypt

## Level 5 - Cookies and Sessions

## Level 6 - Google OAuth 2.0 Authentication
