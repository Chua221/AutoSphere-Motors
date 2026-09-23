# AutoSphere Motors — Used Car Marketplace Portal

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Mock data is served locally through `json-server` (`db.json`).

The login/sign-up pages support three OAuth providers: **Google**, **GitHub**,
and **Facebook**. This needs three processes running at once — the React app,
`json-server`, and a small custom Express backend — all started together by
`npm run dev`.

| Process | Port | Purpose |
|---|---|---|
| React app | 3000 | The UI |
| json-server | 4000 | Mock "database" (`db.json`) |
| oauth-server | 5000 | Exchanges GitHub/Facebook codes for tokens, keeps Client Secrets off the frontend |

## Why Google is different from GitHub/Facebook

Google's [Identity Services](https://developers.google.com/identity/gsi/web)
button gets a signed ID token straight into the browser — no secret needed,
no backend involved. GitHub and Facebook don't offer that for this flow: after
the user approves access, the provider gives the browser a one-time "code",
and turning that into real account access requires the app's **Client
Secret**. That exchange must happen on a server — never in React/browser code
— otherwise the secret is sitting in plain sight in the JS bundle. That's what
`server/oauth-server.js` is for.

## 1. Google setup

1. [Google Cloud Console](https://console.cloud.google.com/) → create/select a project.
2. **APIs & Services → OAuth consent screen** → configure (External, app name, support email).
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:3000`
   - No redirect URI needed for this flow.
4. Copy the **Client ID** into `.env` as `REACT_APP_GOOGLE_CLIENT_ID`.

## 2. GitHub setup

1. [GitHub → Settings → Developer settings → OAuth Apps → New OAuth App](https://github.com/settings/developers)
2. Fill in:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:5000/auth/github/callback`
3. After creating the app, copy the **Client ID**, then click **Generate a new client secret** and copy that too.
4. Put the Client ID in `.env` as `REACT_APP_GITHUB_CLIENT_ID`.
5. Put **both** values in `server/.env` (copy from `server/.env.example`):
   ```
   GITHUB_CLIENT_ID=...
   GITHUB_CLIENT_SECRET=...
   ```

## 3. Facebook setup

1. [developers.facebook.com → My Apps → Create App](https://developers.facebook.com/apps/) → type **Consumer**.
2. Add the **Facebook Login** product → Settings.
3. Set **Valid OAuth Redirect URIs**: `http://localhost:5000/auth/facebook/callback`
4. Under **Settings → Basic**, copy the **App ID** and **App Secret**.
5. Put the App ID in `.env` as `REACT_APP_FACEBOOK_APP_ID`.
6. Put **both** values in `server/.env`:
   ```
   FACEBOOK_APP_ID=...
   FACEBOOK_APP_SECRET=...
   ```
7. Note: while the Facebook app is in **Development mode**, only accounts
   added as Admins/Developers/Testers under **App roles** can log in with it
   — this is normal for a coursework demo and worth mentioning in your
   report; it doesn't need App Review for the assignment.

## 4. Run everything

```bash
npm install
cp .env.example .env                    # fill in the three Client IDs
cp server/.env.example server/.env      # fill in GitHub/Facebook Client ID + Secret
npm run dev                             # starts react app + json-server + oauth-server together
```

**How each login works:** clicking a button either (a) gets a signed ID token
directly from Google in the browser, or (b) sends the browser to
GitHub/Facebook's own login page, which redirects back to `oauth-server`
with a code; the server exchanges that code for the user's profile and
redirects the browser to `/oauth/callback` with a session. Either way, the
app looks the user up in `db.json` by email — logging them in if they already
exist, or creating a new account on first login — so one button covers both
"Sign Up" and "Log In", per the assignment brief. No Client Secret is ever
present in the React bundle.

**To test the required "successful / cancelled / failed" scenarios (Task 7):**
- *Successful*: complete any provider's flow normally.
- *Cancelled*: click a provider button, then click "Cancel"/"Deny" on the
  provider's own consent screen — you'll land back on `/oauth/callback`
  showing a friendly error instead of a broken page.
- *Failed*: temporarily set a wrong Client ID (or stop the corresponding
  server), click the button, and screenshot the resulting error message.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
