package com.autosphere.api.auth;

import com.autosphere.api.auth.dto.OAuthProfile;
import com.autosphere.api.common.BadRequestException;
import com.autosphere.api.user.User;
import com.autosphere.api.user.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

/**
 * Shared "find or create" logic for Google, GitHub and Facebook so all
 * three providers behave identically, whichever one the user picks.
 * If an account with this email already exists (e.g. they originally
 * registered with a password) they are logged into that same account so
 * their existing profile/listings stay intact.
 */
@Service
public class OAuthUserService {

    private final UserRepository userRepository;

    public OAuthUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findOrCreate(OAuthProfile profile, String provider) {
        if (profile.email == null || profile.email.isBlank()) {
            throw new BadRequestException("Your " + provider + " account did not share an email address.");
        }

        return userRepository.findByEmailIgnoreCase(profile.email)
                .orElseGet(() -> {
                    User user = new User();
                    user.setName(profile.name != null && !profile.name.isBlank()
                            ? profile.name
                            : profile.email.split("@")[0]);
                    user.setEmail(profile.email);
                    user.setPasswordHash(null); // OAuth-only account, no local password
                    user.setPhone("");
                    user.setAddress("");
                    user.setPicture(profile.picture);
                    user.setProvider(provider);
                    user.setProviderId(profile.providerId);
                    user.setJoined(LocalDate.now());
                    return userRepository.save(user);
                });
    }
}
