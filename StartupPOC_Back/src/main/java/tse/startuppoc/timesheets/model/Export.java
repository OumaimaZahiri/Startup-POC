package tse.startuppoc.timesheets.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

/** Table to manage the exported months by each user
 * 
 * @author oumai
 *
 */
@Entity
@Table(name = "exported_months")
public class Export {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	/** It's joined to the users' table on the user's id to mark for each user
	 * the month he's exported
	 */
	@OneToOne( fetch = FetchType.EAGER, cascade = CascadeType.ALL ) 
    @JoinColumn(name="user_id" )
    private User user;

	/** String in the format MM/yyyy representing the months the user has exported
	 * 
	 */
    @Column(name = "month")
	private String month;

	/**
	 * @return the user
	 */
	public User getUser() {
		return user;
	}

	/**
	 * @return the month
	 */
	public String getMonth() {
		return month;
	}

	/**
	 * @param user the user to set
	 */
	public void setUser(User user) {
		this.user = user;
	}

	/**
	 * @param month the month to set
	 */
	public void setMonth(String month) {
		this.month = month;
	}
}
