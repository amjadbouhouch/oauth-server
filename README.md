# OAuth-server

## Resources

1. [OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749)
2. [OAuth 2.0 Simplified](https://www.oauth.com/)
3. [oauth2orize](https://www.oauth2orize.org/), [github](https://github.com/jaredhanson/oauth2orize)

## Tools

1. [passportjs](https://www.passportjs.org/docs/)

## Jargon & terminology in oauth2

| Terminology            | Description                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| `Resource Owner`       | The end user (you and me)                                                   |
| `Client`               | Refer to the application (the application that the user is using)           |
| `Authorization server` | Authorization server                                                        |
| `Resource server`      | the `API` or the system that hold the data (google-sheet api, your api,...) |
| `Authorization grant`  | could be `code grant flow`, or there is many grant                          |
| `scopes`               | permission `users.read users.write....`                                     |
| `Concent`              |                                                                             |
| `Redirect url`         | callback url (should be pointed to resource server)                         |
| `id_token`             | a token used for requesting the user's info (email, username, firstName...) |
| `access_token`         | a token used for requesting the data from the `resource server`             |
| `refresh_token`        |                                                                             |

## Authorization(oauth)/Authentication(openid connect) server

### Authentication endpoint

his endpoint will handle the authentication flow by redirecting the user to the authentication server, where they will enter their credentials and authorize the application. Once the user is authenticated, the authentication server will redirect the user back to this endpoint with an authorization code.

The authentication endpoint typically accepts credentials such as a username and password and returns an access token and an ID token, which are used to authenticate the user and authorize access to resources.

a client might request the `email` scope to gain access to a user's email address, or the `openid` scope to request an ID token.

```javascript
app.get("/auth", (req, res) => {
  // Redirect the user to the authentication server
  res.redirect(
    "https://auth.example.com/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/callback"
  );
});
```

### Callback endpoint (Implemented in the resource server)

When the user authenticate themselves, the authentication server will redirect the user's browser to the callback endpoint after the user grants the authorization to the application. The callback endpoint is responsible for handling the response from the authentication server, which typically includes an authorization code.

This endpoint will handle the callback from the authentication server, which contains the `authorization code`. The authorization code can then be exchanged for an access token and ID token. The `access token can be used to access the user's resources`, while the `ID token contains information about the user`.

```javascript
app.get("/callback", (req, res) => {
  // Extract the authorization code from the query string
  const code = req.query.code;

  // Exchange the authorization code for an access token and ID token
  // (this step typically involves making a POST request to the token endpoint)
  request.post(
    "https://auth.example.com/token",
    {
      form: {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "http://localhost:3000/callback",
        client_id: "YOUR_CLIENT_ID",
        client_secret: "YOUR_CLIENT_SECRET",
      },
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        // Extract the access token and ID token from the response
        const accessToken = JSON.parse(body).access_token;
        const idToken = JSON.parse(body).id_token;

        // Use the access token to access the user's resources
        // (this step would typically involve making an authenticated request to an API)
        request.get(
          "https://api.example.com/user",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
          (error, response, body) => {
            if (!error && response.statusCode === 200) {
              // Extract the user information from the response
              const user = JSON.parse(body);

              // Render a user profile page
              res.render("profile", { user });
            }
          }
        );
      }
    }
  );
});
```

### The UserInfo endpoint

You can use this URL to make a GET or POST request to retrieve the user's claims in the form of a JSON object.

```javascript
const request = require("request");

const idToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc3MiOiJodHRwczovL3NhbXBsZS5jb20iLCJhdWQiOiJodHRwczovL2FwaS5zYW1wbGUuY29tIiwic3RhdHVzIjoidHJ1ZSJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// get the issuer from the id_token
// always should be the authentication server base_url
const decoded = jwt.decode(idToken);
const issuer = decoded.iss;

request.get(
  `${issuer}/userinfo`,
  {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  },
  (error, response, body) => {
    if (!error && response.statusCode === 200) {
      // Extract the user information from the response
      const user = JSON.parse(body);
      console.log(user);
    }
  }
);

// OR POST
request.post(
  `${issuer}/userinfo`,
  {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      id_token: idToken,
    },
  },
  (error, response, body) => {
    if (!error && response.statusCode === 200) {
      // Extract the user information from the response
      const user = JSON.parse(body);
      console.log(user);
    }
  }
);
```

### Verifies the access token (The JWKS)

it's a better practice to use `asymmetric cryptography to sign the JWT token`, where a private key is used to sign the token, and the corresponding public key is used to verify the token. In this case, the private key is kept on the authentication server, and the public key is shared with the resource server. This way, the resource server can verify the tokens without having access to the secret key.

Also, another way to validate the token is by using an introspection endpoint, this endpoint could be protected by a Bearer token that the resource server should hold, so it could check the status of the token and the associated claims with it.

#### Example Authentication Server side

```javascript
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// 1. Generate the private/public key pair
const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
    cipher: "aes-256-cbc",
    passphrase: "top secret",
  },
});

// 2. Create a JWKS endpoint
app.get("/jwks", (req, res) => {
  const jwks = {
    keys: [
      {
        kid: "my-key-id",
        kty: "RSA",
        alg: "RS256",
        use: "sig",
        n: publicKey,
        e: "AQAB",
      },
    ],
  };
  res.json(jwks);
});

// 3. Sign the JWT token
const payload = {
  sub: "user-id",
  name: "John Smith",
  iat: Date.now(),
};
const options = {
  algorithm: "RS256",
  expiresIn: "1h",
  audience: "client-id",
  issuer: "http://auth-server.com",
  header: {
    kid: "my-key-id",
  },
};
const token = jwt.sign(payload, privateKey, options);
```

### Example Resource Server side

```javascript
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

// 1. Fetch the JWKS
const client = jwksClient({
  jwksUri: "http://auth-server.com/jwks",
});

// 2. Select the correct key
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// 3. Verify the JWT
app.use((req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) {
      return res.status(401).send("Unauthorized");
    }
    req.user = decoded;
    next();
  });
});

// 4. Check the expiration time, audience, and issuer claims
app.use((req, res, next) => {
  if (req.user.exp < Date.now() / 1000) {
    return res.status(401).send("Token expired");
  }
  if (req.user.aud !== "client-id") {
    return res.status(401).send("Invalid audience");
  }
  if (req.user.iss !== "http://auth-server.com") {
    return res.status(401).send("Invalid issuer");
  }
  next();
});
```
