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

## Level 2a - Encryption with mongoose-encryption
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

Next layer of encryption will involve the usage of environment variables which helps store secrets like encryption keys and API keys.

## Level 2b - Encryption Using Environment Variables
Environment variables will be loaded from a .env into process.env using the NPM package [dotenv](https://www.npmjs.com/package/dotenv).

### NPM Package - dotenv
```sh
$ npm i dotenv
```

At the very top of the app.js the following line of code must be added:
```
require('dotenv').config()
```
Then a .env file is created at the root directory and the environment variables must be created in the form of `NAME=VALUE` for [dotenv](https://www.npmjs.com/package/dotenv).

In this step, the secrets constant was removed from the app.js, reformatted, and placed in the .env file.

app.js :

```
const secret = "Thisisourlittlesecret.";
```

.env :

```
SECRET=Thisisourlittlesecret.
```

**NOTE :** Any usernames, passwords and keys shown are just for demonstration purposes and are not used for the deployed app 🐱‍💻.

## Level 3 - Hashing with md5
For level 3 security, the user password will not be encrypted but instead converted into a **hash value** via a **hash function**. The password gets stored as a hash value in the database and is then compared to the hash value produced when the user tries to login using the password they registered with.

Only the user will know the plain text version of the password while the database stores a hashed version.

The [MD5](https://www.npmjs.com/package/md5) NPM package (based off the MD5 hash function) is used for this example.

### NPM Package - md5
```sh
$ npm i md5
```
The third user is registered as user@hash.com and their password has been replaced with a hash value as seen below in the Robo3T MongoDB GUI.

#### Registration with md5
<img src="docs/register2.png"/><br>

#### Robo3T MongoDB GUI
The database GUI shows three registered users and how their passwords are stored in the database for Levels 1-3. Level 1 depicts basic username and password creation, Level 2 shows the password being encrypted, and Level 3 demonstrates the password being stored as a hash value in the database.

<img src="docs/Robo3T-NewUser3.png"/><br/>

<img src="docs/Robo3T-NewUser3a.png"/><br/>

MD5 hashing algorithm will always produces the same hash value for a plain text password created by a user which is problematic if a database is hacked. If a hacker obtains a list of hash values associated with user accounts, hash tables (which contain hash values for commonly used plain text passwords) can be used to match the hash values and get its corresponding plain text version of the user's password that can be used to hack user's account.

<img src="docs/hashTable.png" /><br>

Level 4 demonstrates how **salting** a hash value adds an extra layer of security.

## Level 4 - Hashing and Salting with bcrypt
Another hashing algorithm, [bcrypt](https://www.npmjs.com/package/bcrypt), can generate a random set of characters, called a **salt**, which gets added to the user's password when they create it. The salt essentially adds length to the user's password which results in a more complex hash value created by the hash function. Both the salt and hash are stored in the database in place of the user's plain text password.

A unique salt is generated for each user that creates a new account and both the salt and hash is stored in the database—So even users with the same plain text password will have different hash values. This means that even if a hacker were to gain access to a database, they won't be able to obtain the plain text versions of the passwords as easily from a hash table due to the salting.

<img src="docs/salt.png"/><br>

An extra layer of security can be added by increasing the number of **salt rounds** a hash value goes through. So once a hash is created, a salt can be added to that value to produce a new hash and then that resulting hash can be salted to produce a new hash, and so on.
<img src="docs/salt1.png" /><br>

<img src="docs/salt2.png" /><br>

After the desired number of salting rounds have been executed, the resulting hash will be stored in the database. The higher the number of rounds you decide to salt your hashes, the longer it takes to produce the resulting hash—so more GPU computing power will be needed for more rounds 🐱‍💻!

For [bcrypt](https://www.npmjs.com/package/bcrypt) the cost for the salting rounds are displayed below. For this example, 10 rounds is sufficient.

<img src="docs/saltRounds.png" /><br>

### NPM Package - bcrypt
```sh
$ npm i bcrypt
```

app.js:
```
const bcrypt = require("bcrypt");
const saltRounds = 10;
```

The hash function gets added at the register post route and the password gets stored as the hash generated by the function:

```
bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    // Store hash in your password DB.
});
```

For the login route, the bcrypt compare method will be used when verifying the password entered versus a hashed and salted version of the password stored in the database:

```
bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    // result == true
});
```
### Registration with bcrypt
The fourth user was registered with the user name of user@bcrypthash.com.
<img src="/docs/register4.png" /><br>

#### Robo3T MongoDB GUI
The database shows Levels 1-4 users and how their passwords are stored in the database. The fourth user's password is stored as a hash value with 10 rounds of salting.

<img src="/docs/Robo3T-NewUser4.png"/><br>

<img src="/docs/Robo3T-NewUser4a.png"/><br>

## Level 5 - Cookies and Sessions

## Level 6 - Google OAuth 2.0 Authentication
