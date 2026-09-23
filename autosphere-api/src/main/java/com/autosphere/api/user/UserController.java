package com.autosphere.api.user;

import com.autosphere.api.common.ForbiddenException;
import com.autosphere.api.common.ResourceNotFoundException;
import com.autosphere.api.security.AuthUtil;
import com.autosphere.api.user.dto.ProfileUpdateRequest;
import com.autosphere.api.user.dto.UserResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        return UserResponse.from(user);
    }

    // Task 1.1 - Profile Management: only phone/address can ever change here.
    // Name and email always come straight back from the stored record.
    @PutMapping("/{id}")
    public UserResponse updateProfile(@PathVariable Long id,
                                       @Valid @RequestBody ProfileUpdateRequest request,
                                       HttpServletRequest httpRequest) {
        Long authUserId = AuthUtil.requireUserId(httpRequest);
        if (!authUserId.equals(id)) {
            throw new ForbiddenException("You can only update your own profile.");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }

        userRepository.save(user);
        return UserResponse.from(user);
    }
}
