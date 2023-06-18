package tse.startuppoc.timesheets.model;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

/** Table managing the teams
 * 
 * @author oumai
 *
 */
@Entity
@Table(name = "team")
public class Team {
 
	@NotNull
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_id")
    public long id;

	@NotNull(message = "Team Name cannot be null")
	@NotEmpty(message = "Team Name cannot be empty")
    @Column(name = "team_name")
    private String name;
    
    @Column(name = "team_created")
    private Date created;
    
	@OneToOne( fetch = FetchType.EAGER, cascade = CascadeType.ALL ) 
    @JoinColumn(name="user_id" )
    private User manager;
	
	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(name = "team_members", joinColumns = @JoinColumn(name = "team_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
	private List<User> members = new ArrayList<>();

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getCreated() {
		return created;
	}

	public void setCreated(Date created) {
		this.created = created;
	}

	
	public User getManager() {
		return manager;
	}

	public void setManager(User manager) {
		this.manager = manager;
	}

	public List<User> getMembers() {
		return members;
	}

	public void setMembers(List<User> members) {
		this.members = members;
	}
}