package tse.startuppoc.timesheets.controller;


import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
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

import tse.startuppoc.timesheets.model.Project;
import tse.startuppoc.timesheets.repository.ProjectRepository;


/** This class is the controlelr managing the projects' route
 * @author oumai
 *
 */
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/project")
public class ProjectController {
	@Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    ProjectRepository projectRepository;
    
    /** This route is for getting all the projects in the database
     * @return a list of the object Project
     */
	@GetMapping("/getprojects")
	public List<Project> findAllProjects(){
		return projectRepository.findAll();
	};

	/** This route is for getting the title of a certain project with a specific id
	 * 
	 * @param id
	 * @return a string with the project's title
	 */
	@GetMapping("/getproject/{id}")
	public String findProject(@PathVariable long id){
		return projectRepository.getOne(id).getTitle();
	};
	
	/** This route if for creating a new project
	 * 
	 * @param project of type Project cf. the package model/Project
	 * @return The project added
	 */
	@PostMapping("/createproject")
	public Project saveProject(@Valid @NotNull @RequestBody Project project ){
		return projectRepository.save(project);
	};
	
	
	/** Route for editing a project
	 * 
	 * @param project : the new version of the project
	 * @return the project updated
	 */
	@PutMapping("/editproject")
	public Project updateProject(@Valid @NotNull @RequestBody Project project ){
		return projectRepository.save(project);
	};
	
	/** Route for deleting the project
	 * @param id
	 */
	@DeleteMapping(value= "/{id}")
	public void deleteProject(@PathVariable long id ){
		projectRepository.deleteById(id);
	};
};
