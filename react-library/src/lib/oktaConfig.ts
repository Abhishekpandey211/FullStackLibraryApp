export const oktaConfig = {
    clientId: '0oal0l7nl7ufmYfmk5d7',
    issuer: 'https://dev-50148790.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}


