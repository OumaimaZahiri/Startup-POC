package tse.startuppoc.timesheets.model;

import java.sql.Date;
import java.time.LocalTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

/** Table for the timesheets
 * 
 * @author oumai
 *
 */
@Entity
@Table(name = "timesheets")
public class Timesheet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "timesheet_id")
    private Long id;
    
    @NotNull
    private Long userId;

    @NotNull
    private Long projectId;

    @NotNull
    private Date day;

    /* The type chosen for this field is LocalTime because normally
     * no user would spend more than 8 hours per day on a project (even less 23 hours)
     * The choice of the type made the adding/editing of timesheets easier 
     */
    @NotNull
    private LocalTime timeSpent;

	/**
	 * @return the id
	 */
	public Long getId() {
		return id;
	}

	/**
	 * @return the day
	 */
	public Date getDay() {
		return day;
	}

	/**
	 * @return the project_id
	 */
	public Long getProjectId() {
		return projectId;
	}

	/**
	 * @return the time_spent
	 */
	public LocalTime getTimSpent() {
		return timeSpent;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * @param day the day to set
	 */
	public void setDay(Date day) {
		this.day = day;
	}

	/**
	 * @param project_id the project_id to set
	 */
	public void setProjectId(Long projectId) {
		this.projectId = projectId;
	}

	/**
	 * @param time_spent the time_spent to set
	 */
	public void setTimeSpent(LocalTime timeSpent) {
		this.timeSpent = timeSpent;
	}

	/**
	 * @return the userId
	 */
	public Long getUserId() {
		return userId;
	}

	/**
	 * @param userId the userId to set
	 */
	public void setUserId(Long userId) {
		this.userId = userId;
	}


}
