package tse.startuppoc.timesheets.model;
import java.util.Date;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "project")
public class Project {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;
    
    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String description;

    private Date startingDate;

    private String estimatedTime;

    private String timeSpent;

	public Long getId() {
		return id;
	}

	/**
	 * @return the estimatedTime
	 */
	public String getEstimatedTime() {
		return estimatedTime;
	}

	/**
	 * @return the timeSpent
	 */
	public String getTimeSpent() {
		return timeSpent;
	}

	/**
	 * @param estimatedTime the estimatedTime to set
	 */
	public void setEstimatedTime(String estimatedTime) {
		this.estimatedTime = estimatedTime;
	}

	/**
	 * @param timeSpent the timeSpent to set
	 */
	public void setTimeSpent(String timeSpent) {
		this.timeSpent = timeSpent;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getStartingDate() {
		return startingDate;
	}

	public void setStartingDate(Date startingDate) {
		this.startingDate = startingDate;
	}
}
