package com.autosphere.api.auth;

import com.autosphere.api.auth.dto.OAuthProfile;
import com.autosphere.api.config.AppProperties;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Server-side half of the GitHub "authorization code" flow. The Client
 * Secret is read from application.properties and never sent to the browser -
 * only this backend ever sees it, exactly as GitHub's OAuth docs require.
 */
@Service
public class GithubOAuthService {

    private final RestTemplate restTemplate;
    private final AppProperties appProperties;

    public GithubOAuthService(RestTemplate restTemplate, AppProperties appProperties) {
        this.restTemplate = restTemplate;
        this.appProperties = appProperties;
    }

    public OAuthProfile exchange(String code) {
        AppProperties.Github cfg = appProperties.getOauth().getGithub();

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("client_id", cfg.getClientId());
        form.add("client_secret", cfg.getClientSecret());
        form.add("code", code);
        form.add("redirect_uri", cfg.getRedirectUri());

        HttpHeaders tokenHeaders = new HttpHeaders();
        tokenHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        tokenHeaders.setAccept(List.of(MediaType.APPLICATION_JSON));

        Map<?, ?> tokenBody = restTemplate.exchange(
                "https://github.com/login/oauth/access_token", HttpMethod.POST,
                new HttpEntity<>(form, tokenHeaders), Map.class).getBody();

        Object accessToken = tokenBody == null ? null : tokenBody.get("access_token");
        if (accessToken == null) {
            String detail = tokenBody != null ? String.valueOf(tokenBody.get("error_description")) : "unknown error";
            throw new RuntimeException("GitHub did not return an access token: " + detail);
        }

        HttpHeaders apiHeaders = new HttpHeaders();
        apiHeaders.setBearerAuth(accessToken.toString());

        Map<?, ?> profile = restTemplate.exchange("https://api.github.com/user", HttpMethod.GET,
                new HttpEntity<>(apiHeaders), Map.class).getBody();

        String email = profile != null ? (String) profile.get("email") : null;
        if (email == null) {
            // GitHub only includes email in /user if the user made it public.
            List<?> emails = restTemplate.exchange("https://api.github.com/user/emails", HttpMethod.GET,
                    new HttpEntity<>(apiHeaders), List.class).getBody();
            if (emails != null) {
                for (Object e : emails) {
                    Map<?, ?> entry = (Map<?, ?>) e;
                    if (Boolean.TRUE.equals(entry.get("primary"))) {
                        email = (String) entry.get("email");
                        break;
                    }
                }
                if (email == null && !emails.isEmpty()) {
                    email = (String) ((Map<?, ?>) emails.get(0)).get("email");
                }
            }
        }

        String name = profile != null ? (String) profile.get("name") : null;
        String login = profile != null ? (String) profile.get("login") : null;
        String avatar = profile != null ? (String) profile.get("avatar_url") : null;
        Object id = profile != null ? profile.get("id") : null;

        return new OAuthProfile(email, name != null ? name : login, avatar, id != null ? id.toString() : null);
    }
}
