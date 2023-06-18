package tse.startuppoc.timesheets.controller;


import tse.startuppoc.timesheets.model.Role;
import tse.startuppoc.timesheets.model.Team;
import tse.startuppoc.timesheets.model.User;
import tse.startuppoc.timesheets.payload.ApiResponse;
import tse.startuppoc.timesheets.repository.RoleRepository;
import tse.startuppoc.timesheets.repository.TeamRepository;
import tse.startuppoc.timesheets.repository.UserRepository;
import tse.startuppoc.timesheets.security.FileUploadUtil;
import tse.startuppoc.timesheets.security.SimpleUser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static tse.startuppoc.timesheets.model.RoleName.ROLE_ADMIN;
import static tse.startuppoc.timesheets.model.RoleName.ROLE_USER_MANAGE;
import static tse.startuppoc.timesheets.model.RoleName.ROLE_VIEW;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;;

/** Controller class for the users' accounts routes
 * 
 * @author oumai
 *
 */
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    TeamRepository teamRepository;
    
    @Value("${login.attempt}")
    private int loginAttemptExceed;

    @Value("${login.pending.status}")
    private int loginPendingStatus;

    @GetMapping("/get-all-locked-account")
    public ResponseEntity<?> getAllLockedAccounts() {

        try {
            List<User> users= userRepository.findByLoginAttempt(loginAttemptExceed);
            return ResponseEntity.ok(new ApiResponse(true,users,"Successfully retrieved all locked accounts"));
        }catch (Exception e){
            return ResponseEntity.ok(new ApiResponse(false,"",e.getMessage()));
        }
    }

    @GetMapping("/get-all-pending-account")
    public ResponseEntity<?> getAllPendingAccounts() {

        try {
            List<User> users= userRepository.findByPendingStatus(loginPendingStatus);
            return ResponseEntity.ok(new ApiResponse(true,users,"Successfully retrieved all pending accounts"));
        }catch (Exception e){
            return ResponseEntity.ok(new ApiResponse(false,"",e.getMessage()));
        }
    }

    @PostMapping("/unlock_account_by_id")
    public ResponseEntity<?> unlockAccount(@RequestBody User users){
        try {
            Optional<User> user= userRepository.findById(users.getId());
            user.get().setLoginAttemptCount(0);
            userRepository.save(user.get());
            return ResponseEntity.ok(new ApiResponse(true,"","Successfully account unlocked"));
        }catch (Exception e){
            return ResponseEntity.ok(new ApiResponse(false,"",e.getMessage()));
        }
    }
    
    @PostMapping("/lock_account_by_id")
    public ResponseEntity<?> lockAccount(@RequestBody User users){
        try {
            Optional<User> user= userRepository.findById(users.getId());
            user.get().setLoginAttemptCount(3);
            userRepository.save(user.get());
            return ResponseEntity.ok(new ApiResponse(true,"","Successfully account locked"));
        }catch (Exception e){
            return ResponseEntity.ok(new ApiResponse(false,"",e.getMessage()));
        }
    }

    /* This is for activating the new created users
     * 
     */
    @PostMapping("/activate_pending_account_by_id")
    public ResponseEntity<?> activatePendingAccountById(@RequestBody User users){
        try {
            Optional <User> user= userRepository.findById(users.getId());
            
            /* If the created user is a manager, the application automatically creates a team for him
             * he should only add members to his team
             */
            if(user.get().getRoles().iterator().next().getName().equals(ROLE_USER_MANAGE) && user.get().getStatus()==2) {
            	Team team = new Team();
            	User user_ = userRepository.findById(users.getId()).orElse(null);	
                team.setManager(user_);
                team.setName(user_.getUsername());
                teamRepository.save(team);
            }   
            user.get().setStatus(3);
            userRepository.save(user.get());
            return ResponseEntity.ok(new ApiResponse(true,"","Successfully account activated"));
            
        }catch (Exception e){
            return ResponseEntity.ok(new ApiResponse(false,"",e.getMessage()));
        }
    }

    @GetMapping("/get-all-users")
    public ResponseEntity<?> getAllUsers(){
        try {
            List<User> user= userRepository.findAll();
            Optional<Role> role_view= roleRepository.findByName(ROLE_VIEW);
            List<User> users = user.stream().filter(x-> {
                return x.getRoles().stream().allMatch(y-> y.getId() ==role_view.get().getId());
            }).collect(Collectors.toList());
           
            Optional<Role> role_user_manage= roleRepository.findByName(ROLE_USER_MANAGE);
            List<User> managers = user.stream().filter(x-> {
                return x.getRoles().stream().allMatch(y-> y.getId() ==role_user_manage.get().getId());
            }).collect(Collectors.toList());
           
            Optional<Role> role_admin= roleRepository.findByName(ROLE_ADMIN);
            List<User> admins = user.stream().filter(x-> {
                return x.getRoles().stream().allMatch(y-> y.getId() ==role_admin.get().getId());
            }).collect(Collectors.toList());
            

            List<List<User>> result = new ArrayList<>();
            result.add(users);
            result.add(managers);
            result.add(admins);
            
            return ResponseEntity.ok(new ApiResponse(true,result,"Successfully data retrieved"));
        }catch (Exception e){
            return ResponseEntity.ok(new ApiResponse(false,"",e.getMessage()));
        }

    }
    
    @GetMapping("/get-all-user")
    public ResponseEntity<?> getAllUserWithPublicAccess(){
        try {
            List<User> user= userRepository.findAll();
            Optional<Role> roles= roleRepository.findByName(ROLE_VIEW);
            List<User> result = user.stream().filter(x-> {
                return x.getRoles().stream().allMatch(y-> y.getId() ==roles.get().getId());
            }).collect(Collectors.toList());

            return ResponseEntity.ok(new ApiResponse(true,result.stream().map(x-> new SimpleUser(x.getId(),x.getFirstname(),x.getLastname(),x.getUsername())),"Successfully data retrieved"));
        }catch (Exception e){
            return ResponseEntity.ok(new ApiResponse(false,"",e.getMessage()));
        }
    }
    
    @PostMapping("/change_role/{id}")
    public ResponseEntity<?> changeRole(@PathVariable long id, @RequestBody Role newrole ) throws IOException {
            try {
	            User user= userRepository.findById(id).orElse(null);
	            Role role = roleRepository.findByName(newrole.getName()).orElse(null);
	            Set<Role> roles = new HashSet<>();
	            if(user.getRoles().iterator().next().getName().equals(ROLE_USER_MANAGE)) {
	            	//delete team
	            	List<Team> listteam = teamRepository.findAll();
	            	for (int i = 0; i < listteam.size(); i++) {
	            		if(listteam.get(i).getManager().getId()==id) {
	            			Team team = listteam.get(i);
	            			team.setManager(null);
	            			team.setMembers(null);
	            			teamRepository.deleteById(team.getId());
	            		}
	            	}
	            }
	            if(newrole.getName().equals(ROLE_USER_MANAGE)) {
	            	Team team = new Team();	
	                team.setManager(user);
	                team.setName(user.getUsername());
	                teamRepository.save(team);
        			System.out.println("added team");
	            } 
	            roles.add(role);
	            user.setRoles(roles);
	            userRepository.save(user);
            return ResponseEntity.ok(new ApiResponse(true,"","Successfully data retrieved"));
        }catch (Exception e){
            return ResponseEntity.ok(new ApiResponse(false,"",e.getMessage()));
        }
    }

    @PostMapping("/upload_image/{id}")
    public ResponseEntity<?> saveUser(@PathVariable long id , @RequestParam("image") MultipartFile multipartFile) throws IOException {
    	try {
    		String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
    		User savedUser =  userRepository.findById(id).orElse(null);
            savedUser.setPhotos(fileName); 
            userRepository.save(savedUser);
            String uploadDir = "src/main/resources/user-photos/" + savedUser.getId();
            FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);
            return ResponseEntity.ok(new ApiResponse(true,"","Successfully photo uploaded"));
    	}catch (Exception e){
    		return ResponseEntity.ok(new ApiResponse(false,"",e.getMessage()));
        }
    }
    
    @PostMapping("/edit")
    public ResponseEntity<?> editUser(@RequestBody User users){
        try {
            Optional<User> user= userRepository.findById(users.getId());
           if (users.getFirstname() !=null)
               user.get().setFirstname(users.getFirstname());
           if (users.getLastname() !=null)
               user.get().setLastname(users.getLastname());
           if (users.getEmail() !=null)
            user.get().setEmail(users.getEmail());
           user.get().setUsername(users.getEmail());

            userRepository.save(user.get());
            return ResponseEntity.ok(new ApiResponse(true,"","Successfully account updated"));
        }catch (Exception e){
            return ResponseEntity.ok(new ApiResponse(false,"",e.getMessage()));
        }
    }


    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody User users){
        try {
            Optional<User> user= userRepository.findById(users.getId());
            Optional<Role> roles= roleRepository.findByName(ROLE_ADMIN);
            if(user.get().getRoles().stream().allMatch(y-> y.getId() ==roles.get().getId())){
                return ResponseEntity.ok(new ApiResponse(false,"","Sorry!,you don't have permission to delete this account"));

            }else {
            	List<Team> listteam = teamRepository.findAll();
            	for (int i = 0; i < listteam.size(); i++) {
            		if(listteam.get(i).getManager().getId()==users.getId()) {
            			Team team = listteam.get(i);
            			team.setManager(null);
            			team.setMembers(null);
            			teamRepository.deleteById(team.getId());
            		}
            		else {
            			for (int j = 0; j < listteam.get(i).getMembers().size(); j++) {
            				if(listteam.get(i).getMembers().get(j).getId()==users.getId()) {
            					listteam.get(i).getMembers().remove(j);
                    			teamRepository.save(listteam.get(i));
                    		}
            			}
            		}
            	}
                user.get().setStatus(1);
                userRepository.delete(user.get());
                return ResponseEntity.ok(new ApiResponse(true,"","Successfully account deleted"));

            }
        }catch (Exception e){
            return ResponseEntity.ok(new ApiResponse(false,"",e.getMessage()));
        }
    }
}
