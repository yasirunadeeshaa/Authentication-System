package backend.social_media_application.security;

import backend.social_media_application.model.User;
import backend.social_media_application.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

//    @Override
//    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
//        User user = userRepository.findByEmail(usernameOrEmail)
//                .orElseGet(() -> userRepository.findByUsername(usernameOrEmail)
//                        .orElseGet(() -> userRepository.findById(usernameOrEmail) // Add this line to try finding by ID
//                                .orElseThrow(() -> new UsernameNotFoundException("User not found with email or username: " + usernameOrEmail))));
//
//        return UserPrincipal.create(user);
//    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(usernameOrEmail)
                .orElseGet(() -> userRepository.findByUsername(usernameOrEmail)
                        .orElseGet(() -> userRepository.findById(usernameOrEmail)
                                .orElseThrow(() ->
                                        new UsernameNotFoundException("User not found with email or username: " + usernameOrEmail))));

        return UserPrincipal.create(user);
    }
}