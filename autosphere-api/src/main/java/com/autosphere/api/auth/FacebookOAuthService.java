package com.autosphere.api.auth;

import com.autosphere.api.auth.dto.OAuthProfile;
import com.autosphere.api.config.AppProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

/**
 * Server-side half of the Facebook Login "authorization code" flow. The App
 * Secret stays in application.properties on this backend only.
 */
@Service
public class FacebookOAuthService {

    private final RestTemplate restTemplate;
    private final AppProperties appProperties;

    public FacebookOAuthService(RestTemplate restTemplate, AppProperties appProperties) {
        this.restTemplate = restTemplate;
        this.appProperties = appProperties;
    }

    public OAuthProfile exchange(String code) {
        AppProperties.Facebook cfg = appProperties.getOauth().getFacebook();

        String tokenUrl = UriComponentsBuilder.fromHttpUrl("https://graph.facebook.com/v19.0/oauth/access_token")
                .queryParam("client_id", cfg.getAppId())
                .queryParam("client_secret", cfg.getAppSecret())
                .queryParam("redirect_uri", cfg.getRedirectUri())
                .queryParam("code", code)
                .toUriString();

        Map<?, ?> tokenBody = restTemplate.getForObject(tokenUrl, Map.class);
        Object accessToken = tokenBody == null ? null : tokenBody.get("access_token");
        if (accessToken == null) {
            throw new RuntimeException("Facebook did not return an access token.");
        }

        String profileUrl = UriComponentsBuilder.fromHttpUrl("https://graph.facebook.com/me")
                .queryParam("fields", "id,name,email,picture")
                .queryParam("access_token", accessToken)
                .toUriString();

        Map<?, ?> profile = restTemplate.getForObject(profileUrl, Map.class);
        if (profile == null) {
            throw new RuntimeException("Facebook did not return a profile.");
        }

        String email = (String) profile.get("email");
        String name = (String) profile.get("name");
        Object id = profile.get("id");

        String picture = null;
        Object pictureObj = profile.get("picture");
        if (pictureObj instanceof Map<?, ?> pictureWrap) {
            Object data = pictureWrap.get("data");
            if (data instanceof Map<?, ?> dataMap) {
                picture = (String) dataMap.get("url");
            }
        }

        return new OAuthProfile(email, name, picture, id != null ? id.toString() : null);
    }
}
