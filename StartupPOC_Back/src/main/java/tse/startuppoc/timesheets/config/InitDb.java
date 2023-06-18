package tse.startuppoc.timesheets.config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import tse.startuppoc.timesheets.model.Role;
import tse.startuppoc.timesheets.model.RoleName;
import tse.startuppoc.timesheets.model.User;
import tse.startuppoc.timesheets.repository.RoleRepository;
import tse.startuppoc.timesheets.repository.UserRepository;

import java.util.Collections;

/**
 * Classe d'initialisation de la base de donnée avec la création d'un user de type admin par défaut
 * et l'intialisation des différents roles exsistant (ROLE_ADMIN,ROLE_USER_MANAGE,ROLE_VIEW)
 * @author VWTHO
 */

@Configuration
public class InitDb implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {

	    try {
	        Role admin = new Role();
	        admin.setId(1);
	        admin.setName(RoleName.ROLE_ADMIN);     
	        
	        Role manager = new Role();
	        manager.setId(2);
	        manager.setName(RoleName.ROLE_USER_MANAGE);       
	        
	        Role user = new Role();
	        user.setId(3);
	        user.setName(RoleName.ROLE_VIEW);
	        
	        roleRepository.save(admin); 
	        roleRepository.save(manager);
	        roleRepository.save(user);
	        

	        User user_admin = new User("Role","Admin","ccc@gmail.com", "cccccc");
	        user_admin.setPassword(passwordEncoder.encode("cccccc"));
	        user_admin.setRoles(Collections.singleton(admin));
	        user_admin.setStatus(3);
	        user_admin.setLoginAttemptCount(0);
	        userRepository.save(user_admin);
    	}
    	catch(Exception e){
    		System.out.println(e);
    	}
        
    }
}