package com.autosphere.api.auth;

import com.autosphere.api.auth.dto.*;
import com.autosphere.api.common.DuplicateResourceException;
import com.autosphere.api.common.UnauthorizedException;
import com.autosphere.api.security.JwtService;
import com.autosphere.api.user.User;
import com.autosphere.api.user.UserRepository;
import com.autosphere.api.user.dto.UserResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/** Plain email/password auth plus the Google leg of OAuth (JSON, called by axios). */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final GoogleOAuthService googleOAuthService;
    private final OAuthUserService oAuthUserService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
                           GoogleOAuthService googleOAuthService, OAuthUserService oAuthUserService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.googleOAuthService = googleOAuthService;
        this.oAuthUserService = oAuthUserService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("An account with this email already exists.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setProvider("local");
        user.setJoined(LocalDate.now());
        userRepository.save(user);

        String token = jwtService.generateToken(user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(UserResponse.from(user), token));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Incorrect email or password."));

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Incorrect email or password.");
        }

        String token = jwtService.generateToken(user.getId());
        return new AuthResponse(UserResponse.from(user), token);
    }

    @PostMapping("/oauth/google")
    public AuthResponse googleLogin(@Valid @RequestBody GoogleAuthRequest request) {
        OAuthProfile profile = googleOAuthService.fetchProfile(request.getAccessToken());
        User user = oAuthUserService.findOrCreate(profile, "google");

        String token = jwtService.generateToken(user.getId());
        return new AuthResponse(UserResponse.from(user), token);
    }
}
