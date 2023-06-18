package tse.startuppoc.timesheets.controller;


import tse.startuppoc.timesheets.exception.AppException;
import tse.startuppoc.timesheets.model.Role;
import tse.startuppoc.timesheets.model.RoleName;
import tse.startuppoc.timesheets.model.User;
import tse.startuppoc.timesheets.payload.ApiResponse;
import tse.startuppoc.timesheets.payload.JwtAuthenticationResponse;
import tse.startuppoc.timesheets.payload.LoginRequest;
import tse.startuppoc.timesheets.payload.SignUpRequest;
import tse.startuppoc.timesheets.repository.RoleRepository;
import tse.startuppoc.timesheets.repository.UserRepository;
import tse.startuppoc.timesheets.security.JwtTokenProvider;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/** This class manages the authentication of the user to the application **/

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;
    
    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider tokenProvider;

    /** This integer is for counting the login failed attempts the user has achieved for the login,
     * the goal is to block the user's account as soon as he exceeds 3 failed login attempts
     */
    @Value("${login.attempt}")
    private int loginAttemptExceed;

    /** This is for verifying if the user's account is activated, deleted or on pending status in which case the user cannot 
     * login until an admin validates his account : status 1= deleted ,2=pending ,3=active
     */
    @Value("${login.pending.status}")
    private int loginPendingStatus;

    /** This function manages the route /signin, which is the toute that manages the login process
     * @param loginRequest which represents the login request the user has sent
     * @return
     */
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        List<User> isUserExist =userRepository.findOneByUsername(loginRequest.getUsername());
        if (!isUserExist.isEmpty()){

            if(isUserExist.get(0).getStatus()==loginPendingStatus){
                return ResponseEntity.ok(new ApiResponse(false,"","Sorry! , Your account has not been activated yet.Please contact your admin"));            }else {
                int loginAttempt =isUserExist.get(0).getLoginAttemptCount();
                if(loginAttempt == loginAttemptExceed){
                    return ResponseEntity.ok(new ApiResponse(false,"","Sorry! , Your account has been locked.Please contact your admin"));
                }else {
                    boolean isPasswordMatch = passwordEncoder.matches(loginRequest.getPassword(), isUserExist.get(0).getPassword());
                    if(isPasswordMatch){
                        Optional<User> user=userRepository.findById(isUserExist.get(0).getId());
                        user.get().setLoginAttemptCount(0);
                        //add info
                        String role = user.get().getRoles().iterator().next().getName().name();
                        String firstname = user.get().getFirstname();
                        String lastname = user.get().getLastname();
                        String photos = user.get().getPhotosImagePath();
                        
                        Long id = user.get().getId();
                        userRepository.save(user.get());
                        
                        Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                        loginRequest.getUsername(),
                                        loginRequest.getPassword()
                                )
                        );
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        String jwt = tokenProvider.generateToken(authentication);
                        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt, role, id, firstname, lastname, photos ));
                    }else {
                        loginAttempt = loginAttempt +1;
                        Optional<User> user=userRepository.findById(isUserExist.get(0).getId());
                        user.get().setLoginAttemptCount(loginAttempt);
                        userRepository.save(user.get());
                        return ResponseEntity.ok(new ApiResponse(false,"","You have entered an invalid user name or password ."));
                    }
                }
            }
        }else {
            return ResponseEntity.ok(new ApiResponse(false,"","Sorry! Your account is not found."));

        }

    }

    /* This function manages the signup's route
     * @param singUpRequest which is a class in the payload package that manages the registration cf. payload/SignUpRequest
     */
    @SuppressWarnings("unchecked")
	@PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        if(userRepository.existsByEmail(signUpRequest.getEmail())) {
            return new ResponseEntity(new ApiResponse(false, "","Email Address already in use!"),
                    HttpStatus.BAD_REQUEST);
        }

        // Creating user's account
        User user = new User(signUpRequest.getFirstname(),signUpRequest.getLastname(),signUpRequest.getEmail(), signUpRequest.getPassword());
        user.setPassword(passwordEncoder.encode(user.getPassword()));


        if (signUpRequest.getUserRole() !=null){
		    if(signUpRequest.getUserRole().equals("ROLE_ADMIN")){
		        Role userRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
		                .orElseThrow(() -> new AppException("User Role not set."));
		        user.setRoles(Collections.singleton(userRole));
		        // status 1= deleted ,2=pending ,3=active
		        user.setStatus(3);
		        user.setLoginAttemptCount(0);
		    } 
		    else if (signUpRequest.getUserRole().equals("ROLE_USER_MANAGE")){
		        Role userRole = roleRepository.findByName(RoleName.ROLE_USER_MANAGE)
		                .orElseThrow(() -> new AppException("User Role not set."));
		        user.setRoles(Collections.singleton(userRole));
		        user.setStatus(2);
		        user.setLoginAttemptCount(0);
		    }
		}
        else {
            Role userRole = roleRepository.findByName(RoleName.ROLE_VIEW)
                    .orElseThrow(() -> new AppException("User Role not set."));
            user.setRoles(Collections.singleton(userRole));
            user.setStatus(2);
            user.setLoginAttemptCount(0);
        }


        User result = userRepository.save(user);
        
        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/users/{username}")
                .buildAndExpand(result.getUsername()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true,"", "User registered successfully"));
    }
}
