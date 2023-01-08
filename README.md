# OAuth-server

## Resources

1. [OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749)
2. [OAuth 2.0 Simplified](https://www.oauth.com/)
3. [oauth2orize](https://www.oauth2orize.org/), [github](https://github.com/jaredhanson/oauth2orize)

## RoadMap

| Feature                                      | Description                     | Status |
| -------------------------------------------- | ------------------------------- | ------ |
| Database model                               | `Client model`, `User model`    | 🕙     |
| Implement simple authentication flow         |                                 | 🛑     |
| Implement simple authorization flow          | `grant_type=authorization_code` | 🛑     |
| Build a web app for managing clients & users |                                 | 🛑     |
|                                              |                                 | 🛑     |

1. Workflow of Resource Owner Password Credentials Grant

`Obtain user credentials`: The user provides the credentials to the application. The user credentials are the resource owner’s user name and password.

**Parameters used in the access token request**

| Parameter                     | Description                                                                                                | Example                                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `X-USER-IDENTITY-DOMAIN-NAME` | The name of the identity domain.                                                                           |                                                                                                 |
| `Authorization: Basic`        | The client identifier and client secret of the client application is base64–encoded and sent in the header | For example, the Authorization header has the value of base64encoded(`client_id:client_secret`) |
| `grant_type`                  | The grant type used to obtain the token                                                                    | `grant_type=password`                                                                           |
| `Content-Type`                | It’s a URL-encoded application                                                                             |                                                                                                 |

**example**

```bash
curl -i -H 'X-USER-IDENTITY-DOMAIN-NAME: OAuthTestTenant125'
-H 'Authorization: Basic MzAzYTI0OTItZDY0Zi00ZTA0LWI3OGYtYjQzMzAwNDczMTJiOll5Sk5NSkdFc0ZqUkxWZVZsdVMz'
-H 'Content-Type: application/x-www-form-urlencoded;charset=UTF-8'
--request POST https://<idm-domain>.identity.<data-center>.oraclecloud.com/oauth/tokens
-d 'grant_type=password
&username=test
&password=test
&scope=http://www.example.com'
```

**Output**

```json
{
  "expires_in": 3600,
  "token_type": "Bearer",
  "access_token": "eyJhbGciO-x8XWmQtUR6c_jkE6TlMPp7AzR32QudnAA"
}
```

## Build an OAuth 2 server steps

1. Choose a grant type or types to support. The grant types define how clients can request access tokens from the authorization server. The OAuth 2 specification defines four grant types: `authorization code`, implicit, `resource owner password credentials`, and `client credentials`.

2. Define the client model

```javascript
const clients = [
  {
    clientId: "abc123",
    clientSecret: "xyz456",
    redirectUri: "https://example.com/callback",
    grantTypes: ["authorization_code", "password"],
  },
];

const users = [
  {
    username: "user1",
    password: "password1",
  },
  // ...
];
```

The client model should include the following fields:

`clientId`: The unique ID of the client.
`clientSecret`: The client secret, which is used to authenticate the client when making requests to the authorization server.
`redirectUri`: The redirect URI, which is the URI that the authorization server will redirect the user to after the user grants or denies access.
`grantTypes`: The grant types that the client is allowed to use.

3. End-points

a. resource owner password credentials

```javascript
app.post("/token", function (req, res) {
  var auth = req.headers["authorization"];
  if (auth) {
    // check the auth header
    var clientCredentials = Buffer.from(auth.slice("basic ".length), "base64")
      .toString()
      .split(":");
    var clientId = querystring.unescape(clientCredentials[0]);
    var clientSecret = querystring.unescape(clientCredentials[1]);
  }

  // otherwise, check the post body
  if (req.body.client_id) {
    if (clientId) {
      // if we've already seen the client's credentials in the authorization header, this is an error
      console.log("Client attempted to authenticate with multiple methods");
      res.status(401).json({ error: "invalid_client" });
      return;
    }

    var clientId = req.body.client_id;
    var clientSecret = req.body.client_secret;
  }

  var client = getClient(clientId);
  if (!client) {
    console.log("Unknown client %s", clientId);
    res.status(401).json({ error: "invalid_client" });
    return;
  }

  if (client.client_secret != clientSecret) {
    console.log(
      "Mismatched client secret, expected %s got %s",
      client.client_secret,
      clientSecret
    );
    res.status(401).json({ error: "invalid_client" });
    return;
  }

  if (req.body.grant_type == "authorization_code") {
    var code = codes[req.body.code];

    if (code) {
      delete codes[req.body.code]; // burn our code, it's been used
      if (code.request.client_id == clientId) {
        var access_token = randomstring.generate();

        nosql.insert({
          access_token: access_token,
          client_id: clientId,
          scope: code.scope,
        });

        console.log("Issuing access token %s", access_token);
        console.log("with scope %s", access_token, scope);

        var cscope = null;
        if (code.scope) {
          cscope = code.scope.join(" ");
        }

        var token_response = {
          access_token: access_token,
          token_type: "Bearer",
          scope: cscope,
        };

        res.status(200).json(token_response);
        console.log("Issued tokens for code %s", req.body.code);

        return;
      } else {
        console.log(
          "Client mismatch, expected %s got %s",
          code.request.client_id,
          clientId
        );
        res.status(400).json({ error: "invalid_grant" });
        return;
      }
    } else {
      console.log("Unknown code, %s", req.body.code);
      res.status(400).json({ error: "invalid_grant" });
      return;
    }
  } else if (req.body.grant_type == "client_credentials") {
    var scope = req.body.scope ? req.body.scope.split(" ") : undefined;
    var client = getClient(query.client_id);
    var cscope = client.scope ? client.scope.split(" ") : undefined;
    if (__.difference(scope, cscope).length > 0) {
      // client asked for a scope it couldn't have
      res.status(400).json({ error: "invalid_scope" });
      return;
    }

    var access_token = randomstring.generate();
    var token_response = {
      access_token: access_token,
      token_type: "Bearer",
      scope: scope.join(" "),
    };
    nosql.insert({
      access_token: access_token,
      client_id: clientId,
      scope: scope,
    });
    console.log("Issuing access token %s", access_token);
    res.status(200).json(token_response);
    return;
  } else if (req.body.grant_type == "refresh_token") {
    nosql.find().make(function (builder) {
      builder.where("refresh_token", req.body.refresh_token);
      builder.callback(function (err, tokens) {
        if (tokens.length == 1) {
          var token = tokens[0];
          if (token.client_id != clientId) {
            console.log(
              "Invalid client using a refresh token, expected %s got %s",
              token.client_id,
              clientId
            );
            nosql.remove().make(function (builder) {
              builder.where("refresh_token", req.body.refresh_token);
            });
            res.status(400).end();
            return;
          }
          console.log("We found a matching token: %s", req.body.refresh_token);
          var access_token = randomstring.generate();
          var token_response = {
            access_token: access_token,
            token_type: "Bearer",
            refresh_token: req.body.refresh_token,
          };
          nosql.insert({ access_token: access_token, client_id: clientId });
          console.log(
            "Issuing access token %s for refresh token %s",
            access_token,
            req.body.refresh_token
          );
          res.status(200).json(token_response);
          return;
        } else {
          console.log("No matching token was found.");
          res.status(401).end();
        }
      });
    });
  } else if (req.body.grant_type == "password") {
    var username = req.body.username;
    var user = getUser(username);
    if (!user) {
      console.log("Unknown user %s", user);
      res.status(401).json({ error: "invalid_grant" });
      return;
    }
    console.log("user is %j ", user);

    var password = req.body.password;
    if (user.password != password) {
      console.log(
        "Mismatched resource owner password, expected %s got %s",
        user.password,
        password
      );
      res.status(401).json({ error: "invalid_grant" });
      return;
    }

    var scope = req.body.scope;

    var token_response = generateTokens(req, res, clientId, user, scope);

    res.status(200).json(token_response);
    return;
  } else {
    console.log("Unknown grant type %s", req.body.grant_type);
    res.status(400).json({ error: "unsupported_grant_type" });
  }
});
```

## building an app that talks to an existing OAuth 2.0 API

### Create an Application

The registration process typically involves creating a developer account on the service’s website, then entering basic information about the application such as the name, website, logo, etc. After registering the application, you’ll be given a `client_id` (and a `client_secret` in some cases) that you’ll use when your app interacts with the service.

One of the most important things when creating the application is to `register one or more redirect URLs` the application will use.

OAuth services should be looking for an exact match of the redirect URL. This means a redirect URL of https://example.com/auth would not match https://example.com/auth?destination=account. It is best practice to avoid using query string parameters in your redirect URL, and have it include just a path.

The `“state` parameter can be used to encode application state, but it must also include some amount of random data if you’re not also including PKCE parameters in the request. The state parameter is a string that is opaque to the OAuth 2.0 service, so whatever state value you pass in during the initial authorization request will be returned after the user authorizes the application.

### Setting up the Environment

More details

// TODO

### Authorization Request

When the user approves the request, they will be redirected back to `our page with code and state parameters in the request`. The next step is to exchange the `authorization code` for an access token.

![image](https://www.oauth.com/wp-content/uploads/2018/07/github_oauth_prompt-688x1024.png)

### Obtaining an Access Token

1. `access_token` (required) The access token string as issued by the authorization server.
2. `token_type` (required) The type of token this is, typically just the string “Bearer”.
   expires_in (recommended) If the access token expires, the server should reply with the duration of time the access token is granted for.
3. `refresh_token` (optional) If the access token will expire, then it is useful to return a refresh token which applications can use to obtain another access token. However, tokens issued with the implicit grant cannot be issued a refresh token.
4. `scope` (optional) If the scope the user granted is identical to the scope the app requested, this parameter is optional. If the granted scope is different from the requested scope, such as if the user modified the scope, then this parameter is required.

```json
{
  "access_token": "MTQ0NjJkZmQ5OTM2NDE1ZTZjNGZmZjI3",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "IwOGYzYTlmM2YxOTQ5MGE3YmNmMDFkNTVk",
  "scope": "create"
}
```

### Unsuccessful Response

Error responses are returned with an HTTP `400` status code (unless specified otherwise), with error and error_description parameters. The error parameter will always be one of the values listed below.

1. `invalid_request` – The request is missing a parameter so the server can’t proceed with the request. This may also be returned if the request includes an unsupported parameter or repeats a parameter.
2. `invalid_client` – Client authentication failed, such as if the request contains an invalid client ID or secret. Send an HTTP 401 response in this case.
3. `invalid_grant` – The authorization code (or user’s password for the password grant type) is invalid or expired. This is also the error you would return if the redirect URL given in the authorization grant does not match the URL provided in this access token request.
4. `invalid_scope` – For access token requests that include a scope (password or client_credentials grants), this error indicates an invalid scope value in the request.
   unauthorized_client – This client is not authorized to use the requested grant type. For example, if you restrict which applications can use the Implicit grant, you would return this error for the other apps.
5. `unsupported_grant_type` – If a grant type is requested that the authorization server doesn’t recognize, use this code. Note that unknown grant types also use this specific error code rather than using the invalid_request above.

```json
{
  "error": "invalid_request",
  "error_description": "Request was missing the 'redirect_uri' parameter.",
  "error_uri": "See the full API docs at https://authorization-server.com/docs/access_token"
}
```

There are two optional parameters when returning an error response, `error_description` and `error_uri`. These are meant to give developers more information about the error, not intended to be shown to end users. However, keep in mind that many developers will pass this error text straight on to end users no matter how much you warn them, so it is a good idea to make sure it is at least somewhat helpful to end users as well.

### Self-Encoded Access Tokens

Self-encoded tokens provide a way to avoid storing tokens in a database by encoding all of the necessary information in the token string itself. The main benefit of this is that API servers are able to verify access tokens without doing a database lookup on every API request, making the API much more easily scalable.

**JWT Access Token Encoding**

The code below is written in PHP and uses the Firebase PHP-JWT library to encode and verify tokens. You’ll need to include that library in order to run the sample code

```php
<?php
use \Firebase\JWT\JWT;

# Generate a private key to sign the token.
# The public key would need to be published at the authorization
# server if a separate resource server needs to validate the JWT

$private_key = openssl_pkey_new([
  'digest_alg' => 'sha256',
  'private_key_bits' => 1024,
  'private_key_type' => OPENSSL_KEYTYPE_RSA
]);

# Set the user ID of the user this token is for
$user_id = 1000;

# Set the client ID of the app that is generating this token
$client_id = 'https://example-app.com';

# Provide the list of scopes this token is valid for
$scope = 'read write';

$token_data = array(

  # Issuer (the authorization server identifier)
  'iss' => 'https://' . $_SERVER['PHP_SELF'],

  # Expires At
  'exp' => time()+7200, // Valid for 2 hours

  # Audience (The identifier of the resource server)
  'aud' => 'api://default',

  # Subject (The user ID)
  'sub' => $user_id,

  # Client ID
  'client_id' => $client_id,

  # Issued At
  'iat' => time(),

  # Identifier of this token
  'jti' => microtime(true).'.'.bin2hex(random_bytes(10)),

  # The list of OAuth scopes this token includes
  'scope' => $scope
);
$token_string = JWT::encode($token_data, $private_key, 'RS256');
```

```json
{
  "iss": "https://authorization-server.com/",
  "exp": 1637344572,
  "aud": "api://default",
  "sub": 1000,
  "client_id": "https://example-app.com",
  "iat": 1637337372,
  "jti": "1637337372.2051.620f5a3dc0ebaa097312",
  "scope": "read write"
}
```

More details: https://www.oauth.com/oauth2-servers/access-tokens/self-encoded-access-tokens/

**JWT Access Token Decoding**

Verifying the access token can be done by using the same JWT library. The library will decode and verify the signature at the same time, and throws an exception if the signature was invalid, or if the expiration date of the token has already passed.

You’ll need the public key corresponding to the private key that signed the token. Typically you can fetch this from the authorization server’s metadata document, but in this example we will derive the public key from the private key generated earlier.

**Note:** Anyone can read the token information by base64-decoding the middle section of the token string. For this reason, it’s important that you do not store private information or information you do not want a user or developer to see in the token. If you want to hide the token information, you can use the JSON Web Encryption spec to encrypt the data in the token.

```php
$public_key = openssl_pkey_get_details($private_key)['key'];

try {
  # Note: You must provide the list of supported algorithms in order to prevent
  # an attacker from bypassing the signature verification. See:
  # https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/
  $token = JWT::decode($token_string, $jwt_key, ['RS256']);
  $error = false;
} catch(\Firebase\JWT\ExpiredException $e) {
  $token = false;
  $error = 'expired';
  $error_description = 'The token has expired';
} catch(\Firebase\JWT\SignatureInvalidException $e) {
  $token = false;
  $error = 'invalid';
  $error_description = 'The token provided was malformed';
} catch(Exception $e) {
  $token = false;
  $error = 'unauthorized';
  $error_description = $e->getMessage();
}

if($error) {
  header('HTTP/1.1 401 Unauthorized');
  echo json_encode(array(
    'error'=>$error,
    'error_description'=>$error_description
  ));
  die();
} else {
  // Now $token has all the data that we encoded in it originally
  print_r($token);
}
```

**JWT Access Token Invalidating**

Because the token can be verified without doing a database lookup, there is no way to invalidate a token until it expires. You’ll need to take additional steps to invalidate tokens that are self-encoded, such as temporarily storing a list of revoked tokens, which is one use of the jti claim in the token. See [Refreshing Access Tokens for more information](https://www.oauth.com/oauth2-servers/access-tokens/refreshing-access-tokens/).

**Refresh token flow**

![image](imgs/refresh_token_flow.png)
Referance: [datatracker.ietf.org](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-07#name-refresh-token)

**Refreshing Access Tokens**

This section describes how to allow your developers to use refresh tokens to obtain new access tokens. If your service issues refresh tokens along with the access token, then you’ll need to implement the Refresh grant type described here.

Request Parameters
The access token request will contain the following parameters.

`grant_type` (required)
The `grant_type` parameter must be set to `refresh_token`.

`refresh_token` (required)
The refresh token previously issued to the client.

`scope` (optional)
The requested scope must not include additional scopes that were not issued in the original access token. Typically this will not be included in the request, and if omitted, the service should issue an access token with the same scope as was previously issued.

1. Client Authentication (required if the client was issued a secret)

Typically, refresh tokens are only used with confidential clients. However, since it is possible to use the authorization code flow without a client secret, the refresh grant may also be used by clients that don’t have a secret. If the client was issued a secret, then the client must authenticate this request. Typically the service will allow either additional request parameters `client_id` and `client_secret`, or accept the client ID and secret in the HTTP Basic auth header. If the client does not have a secret, then no client authentication will be present in this request.

2. Verifying the refresh token grant

After checking for all required parameters, and authenticating the client if the client was issued a secret, the authorization server can continue verifying the other parts of the request.

The server then checks whether the refresh token is valid, and has not expired. If the refresh token was issued to a confidential client, the service must ensure the refresh token in the request was issued to the authenticated client.

If everything checks out, the service can [generate an access token](https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/) and respond. The server may issue a new refresh token in the response, but if the response does not include a new refresh token, the client assumes the existing refresh token will still be valid.

```
POST /oauth/token HTTP/1.1
Host: authorization-server.com

grant_type=refresh_token
&refresh_token=xxxxxxxxxxx
&client_id=xxxxxxxxxx
&client_secret=xxxxxxxxxx
```

### Listing Authorizations

Once users have begun to authorize multiple applications, giving many apps access to their account, it becomes necessary to provide a way to allow the user to manage the apps that have access. This is usually presented to the user in an account settings page or an account privacy page.

There is nothing in the OAuth 2.0 spec that requires users be able to revoke accesss or even suggests how to do this, so instead we’ll look at several major API providers for inspiration on how to accomplish this.

Most providers have a page which lists all applications the user has authorized to their account. Usually there is some information displayed about the application, and information meant to give context to the user about when and why this application has access.

Google provides a list of applications you’ve authorized on your account at

![image](https://www.oauth.com/wp-content/uploads/2016/08/google-authorization-list.png)

### Revoking Access

There are a few reasons you might need to revoke an application’s access to a user’s account.

1. The user explicitly wishes to revoke the application’s access, such as if they’ve found an application they no longer want to use listed on their authorizations page
2. The developer wants to revoke all user tokens for their application
3. The developer deleted their application
4. You as the service provider have determined an application is compromised or malicious, and want to disable it

More details: https://www.oauth.com/oauth2-servers/listing-authorizations/revoking-access/

### The Resource Server

The resource server is the OAuth 2.0 term for your API server. The resource server handles authenticated requests after the application has obtained an access token.

Large scale deployments may have more than one resource server. oogle’s services, for example, have dozens of resource servers, such as the Google Cloud platform, Google Maps, Google Drive, Youtube, Google+, and many others. Each of these resource servers are distinctly separate, but they all share the same authorization server.

![image](https://www.oauth.com/wp-content/uploads/2016/08/google-apis.png)

More details: https://www.oauth.com/oauth2-servers/the-resource-server/

###

### OAuth for Native Apps

These recommendations for native apps are published as an RFC 8252, where these concepts are described in more explicit detail.

1. [Use a System Browser](https://www.oauth.com/oauth2-servers/oauth-native-apps/use-system-browser/)
2. [Redirect URLs for Native Apps](https://www.oauth.com/oauth2-servers/oauth-native-apps/redirect-urls-for-native-apps/)
3. [PKCE (Proof Key for Code Exchange) Extension](https://www.oauth.com/oauth2-servers/oauth-native-apps/pkce/)
4. [Checklist for Server Support for Native Apps](https://www.oauth.com/oauth2-servers/oauth-native-apps/checklist-server-support-native-apps/)

### Security Considerations

Details: https://www.oauth.com/oauth2-servers/device-flow/security-considerations/

### Tools and Libraries

1. [OAuth 2.0 Playground](https://www.oauth.com/playground/)
2. https://example-app.com/client
3. https://oauth.net/code/
4. [jwt.io](https://jwt.io)
5. https://oauth.net/videos/

### Making API Requests

```
GET /user/repos?sort=created&direction=desc HTTP/1.1
Host: api.github.com
Accept: application/vnd.github.v3+json
User-Agent: https://example-app.com/
Authorization: Bearer e2f8c8e136c73b1e909bb1021b3b4c29
```
