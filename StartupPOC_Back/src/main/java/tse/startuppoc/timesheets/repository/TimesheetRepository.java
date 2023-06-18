package tse.startuppoc.timesheets.repository;

import java.sql.Time;
import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import tse.startuppoc.timesheets.model.Timesheet;

/** Timesheet's repository which inherits from the JpaRepository
 * 
 * @author oumai
 *
 */
public interface TimesheetRepository extends JpaRepository<Timesheet,Long> {

	/* Find the timesheets of a specific user */
    @Query(value = "SELECT * FROM timesheets arp where arp.user_id=?1  ",nativeQuery = true)
    List<Timesheet> findByUser(Long id);
    
    /* Get the timesheets of a user of a whole month */
    @Query(value = "SELECT * FROM timesheets arp WHERE DATE_FORMAT(arp.day, '%m/%y')=?1"
    		+ " AND arp.user_id=?2", nativeQuery = true)
    List<Timesheet> getTimesheetsByMonth(String month, Long id);

    /* Get the timesheets of a specific user for a specific day */
    @Query(value = "SELECT * FROM timesheets arp where arp.day=?1 and arp.user_id=?2  ",nativeQuery = true)
    List<Timesheet> findByDayAndUser(Date date, Long id);

    /* Get the projects a specifis user has spent time on during a certain month (for the timesheets' exports not to 
     * be charged with projects the user never spent time on that month
     */
    @Query(value = "SELECT arp.project_id FROM timesheets arp WHERE DATE_FORMAT(arp.day, '%m/%y')=?1 AND arp.user_id=?2", nativeQuery = true)
    List<Long> projectsByMonthAndUser(String month, Long id);

    /* Get the time the user spent on a specific project during a specific day */
    @Query(value = "SELECT arp.time_spent FROM timesheets arp WHERE arp.day=?1 AND arp.project_id=?2 AND arp.user_id=?3", nativeQuery = true)
    Time findTimeSpentPerDayAndProject(String date, Long project_id, Long user_id);
}