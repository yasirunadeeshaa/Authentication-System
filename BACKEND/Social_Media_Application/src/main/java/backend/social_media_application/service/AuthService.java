package backend.social_media_application.service;

import backend.social_media_application.dto.AuthResponse;
import backend.social_media_application.dto.LoginRequest;
import backend.social_media_application.dto.SignupRequest;
import backend.social_media_application.dto.UserDTO;
import backend.social_media_application.exception.BadRequestException;
import backend.social_media_application.exception.ResourceNotFoundException;
import backend.social_media_application.model.User;
import backend.social_media_application.repository.UserRepository;
import backend.social_media_application.security.JwtTokenProvider;
import backend.social_media_application.security.UserPrincipal;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final OTPService otpService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       OTPService otpService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.otpService = otpService;
    }

    public AuthResponse register(SignupRequest signupRequest) {
        System.out.println("Starting registration for email: " + signupRequest.getEmail());

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new BadRequestException("Email already in use!");
        }

        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new BadRequestException("Username already taken!");
        }

        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setFirstName(signupRequest.getFirstName());
        user.setLastName(signupRequest.getLastName());
        user.setActive(true);
        user.setVerified(false); // Email not verified yet

        System.out.println("Saving user to database...");
        User savedUser = userRepository.save(user);
        System.out.println("User saved with ID: " + savedUser.getId());

        // Generate and send OTP after saving user
        System.out.println("Generating and sending OTP...");
        otpService.generateAndSendOTP(signupRequest.getEmail());
        System.out.println("OTP sent to: " + signupRequest.getEmail());

        try {
            System.out.println("Attempting authentication...");
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            signupRequest.getEmail(),
                            signupRequest.getPassword()
                    )
            );
            System.out.println("Authentication successful");

            System.out.println("Generating token...");
            String token = tokenProvider.generateToken(authentication);
            System.out.println("Token generated: " + token);

            System.out.println("Converting user to DTO...");
            UserDTO userDTO = convertToDTO(savedUser);

            return new AuthResponse(token, userDTO);

        } catch (Exception e) {
            System.out.println("Authentication failed: " + e.getMessage());
            // Create Authentication object from UserPrincipal
            UserPrincipal userPrincipal = UserPrincipal.create(savedUser);
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userPrincipal, null, userPrincipal.getAuthorities());

            String token = tokenProvider.generateToken(authentication);
            return new AuthResponse(token, convertToDTO(savedUser));
        }
    }

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new AuthResponse(token, convertToDTO(user));
    }

    public boolean verifyEmail(String email, String otp) {
        if (otpService.verifyOTP(email, otp)) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            user.setVerified(true);
            userRepository.save(user);
            System.out.println("Email verified successfully for: " + email);
            return true;
        }
        System.out.println("Email verification failed for: " + email);
        return false;
    }

    public void resendOTP(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.isVerified()) {
            throw new BadRequestException("Email already verified");
        }

        otpService.generateAndSendOTP(email);
        System.out.println("OTP resent to: " + email);
    }

    private UserDTO convertToDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setAvatar(user.getAvatar());
        userDTO.setBio(user.getBio());
        userDTO.setVerified(user.isVerified());
        userDTO.setCreatedAt(user.getCreatedAt());
        return userDTO;
    }
}