package com.autosphere.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private String clientUrl = "http://localhost:3000";
    private final Jwt jwt = new Jwt();
    private final OAuth oauth = new OAuth();

    public String getClientUrl() { return clientUrl; }
    public void setClientUrl(String clientUrl) { this.clientUrl = clientUrl; }
    public Jwt getJwt() { return jwt; }
    public OAuth getOauth() { return oauth; }

    public static class Jwt {
        private String secret;
        private long expirationMs = 86_400_000L;
        public String getSecret() { return secret; }
        public void setSecret(String secret) { this.secret = secret; }
        public long getExpirationMs() { return expirationMs; }
        public void setExpirationMs(long expirationMs) { this.expirationMs = expirationMs; }
    }

    public static class OAuth {
        private final Github github = new Github();
        private final Facebook facebook = new Facebook();
        public Github getGithub() { return github; }
        public Facebook getFacebook() { return facebook; }
    }

    public static class Github {
        private String clientId;
        private String clientSecret;
        private String redirectUri;
        public String getClientId() { return clientId; }
        public void setClientId(String clientId) { this.clientId = clientId; }
        public String getClientSecret() { return clientSecret; }
        public void setClientSecret(String clientSecret) { this.clientSecret = clientSecret; }
        public String getRedirectUri() { return redirectUri; }
        public void setRedirectUri(String redirectUri) { this.redirectUri = redirectUri; }
    }

    public static class Facebook {
        private String appId;
        private String appSecret;
        private String redirectUri;
        public String getAppId() { return appId; }
        public void setAppId(String appId) { this.appId = appId; }
        public String getAppSecret() { return appSecret; }
        public void setAppSecret(String appSecret) { this.appSecret = appSecret; }
        public String getRedirectUri() { return redirectUri; }
        public void setRedirectUri(String redirectUri) { this.redirectUri = redirectUri; }
    }
}
