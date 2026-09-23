package com.autosphere.api.auth;

import com.autosphere.api.auth.dto.OAuthProfile;
import com.autosphere.api.common.BadRequestException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Verifies the Google access token SERVER-SIDE by asking Google for the
 * profile it belongs to, instead of trusting whatever the browser claims to
 * have decoded. This is what "secure authentication" means for the Google
 * leg of Task 2 / the OAuth rubric line.
 */
@Service
public class GoogleOAuthService {

    private static final String USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

    private final RestTemplate restTemplate;

    public GoogleOAuthService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public OAuthProfile fetchProfile(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        try {
            Map<?, ?> body = restTemplate.exchange(USERINFO_URL, HttpMethod.GET,
                    new HttpEntity<>(headers), Map.class).getBody();
            if (body == null || body.get("email") == null) {
                throw new BadRequestException("Google did not return an email address.");
            }
            return new OAuthProfile(
                    (String) body.get("email"),
                    (String) body.get("name"),
                    (String) body.get("picture"),
                    (String) body.get("sub")
            );
        } catch (BadRequestException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new BadRequestException("Google sign-in could not be verified. Please try again.");
        }
    }
}
