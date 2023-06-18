package tse.startuppoc.timesheets.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tse.startuppoc.timesheets.model.Team;
import tse.startuppoc.timesheets.model.User;
import tse.startuppoc.timesheets.payload.ApiResponse;
import tse.startuppoc.timesheets.repository.TeamRepository;
import tse.startuppoc.timesheets.repository.UserRepository;

/** Class that manages the teams' routes
 * 
 * @author oumai
 *
 */
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/team")
public class TeamController {
	@Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    TeamRepository teamRepository;
    
    @Autowired
    UserRepository userRepository;
    
    /** Team routes **/
	@GetMapping("/getteams")
	public List<Team> findAllTeams(){
		return teamRepository.findAll();
	}
	
	@GetMapping(value= "/getteam/{id}")
	public ResponseEntity<?> getTeamByManagerId(@PathVariable long id ){
		for (Team team : teamRepository.findAll()) {
		    if(team.getManager().getId() == id) {
		    	return ResponseEntity.ok(team);
		    }
		}
	    return ResponseEntity.ok(new ApiResponse(false,"","No team associated with this user"));
	};
	
	@PostMapping("/postteam")
	public Team saveTeam(@Valid @NotNull @RequestBody Team team ){
		return teamRepository.save(team);
	};
	
	@PostMapping("/addmembers")
	public Team addMembers(@Valid @NotNull @RequestBody Team team ){
		List<User> members = new ArrayList<>();
		for(int i = 0; i < team.getMembers().size(); i++) {
			User user_ = userRepository.findById(team.getMembers().get(i).getId()).orElse(null);
			if(user_!=null) {
				members.add(user_);
			}
		}
		team.setMembers(members);
		return teamRepository.save(team);
	};
	
	@PostMapping("/change_manager/{id}")
	public ResponseEntity<?> changeManagerByUserId(@PathVariable @NotNull Long id, @Valid @NotNull @RequestBody User user ){
		List<Team> listteam = teamRepository.findAll();
    	for (int i = 0; i < listteam.size(); i++) {
			Team team = listteam.get(i);
    		for(int j = 0; j < team.getMembers().size(); j++) {
    			if(team.getMembers().get(j).getId()==id) {
    				team.getMembers().remove(j);
    			}
    		}
    	}
    	for (int i = 0; i < listteam.size(); i++) {
    		if(listteam.get(i).getManager().getId()==user.getId()){
				System.out.println("managerfind");
				User user_ = userRepository.findById(id).orElse(null);
				listteam.get(i).getMembers().add(user_);
				teamRepository.save(listteam.get(i));
				return ResponseEntity.ok(new ApiResponse(true,"","Successfully add new manager"));
    		}
    	}
    	return ResponseEntity.ok(new ApiResponse(false,"","error")); 
	};
	
	@PostMapping("/deletememberbyid/{id}")
	public ResponseEntity<?> deleteMemberById(@PathVariable @NotNull Long id, @Valid @NotNull @RequestBody Team team_ ){
		try {
            Team team = teamRepository.findById(team_.getId()).orElse(null);
            for(int i = 0; i < team.getMembers().size(); i++) {
    			User user_ = userRepository.findById(team.getMembers().get(i).getId()).orElse(null);
    			if(team.getMembers().get(i).getId()== id ) {
    				team.getMembers().remove(i);
    			}
    		}
            teamRepository.save(team);
            return ResponseEntity.ok(new ApiResponse(true,"","Successfully member deleted"));
            }
        catch (Exception e){
            return ResponseEntity.ok(new ApiResponse(false,"",e.getMessage()));
        }
	};
	
	@PutMapping("/updateteam")
	public Team updateTeam(@Valid @NotNull @RequestBody Team team ){
		return teamRepository.save(team);
	};
	
	@DeleteMapping(value= "/{id}")
    public ResponseEntity<?> delete(@RequestBody Team team_){
	        try {
	            Optional<Team> team = teamRepository.findById(team_.getId());
	            team.get().setMembers(null);
	            team.get().setManager(null);
	            teamRepository.delete(team.get());
	            return ResponseEntity.ok(new ApiResponse(true,"","Successfully team deleted"));
	            }
	        catch (Exception e){
	            return ResponseEntity.ok(new ApiResponse(false,"",e.getMessage()));
	        }
	};
}
