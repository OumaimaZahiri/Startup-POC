package tse.startuppoc.timesheets.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.sql.Date;
import java.time.LocalTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import tse.startuppoc.timesheets.model.Timesheet;
import tse.startuppoc.timesheets.repository.TimesheetRepository;

@SpringBootTest
class TimesheetRepositoryTest {

	@Autowired
	private TimesheetRepository timesheetRepository;

	@SuppressWarnings("deprecation")
	@Test
	void testAddTimesheet() {
		Timesheet timesheet = new Timesheet();
		timesheet.setDay(new Date(4,3,2022));
		timesheet.setProjectId((long) 2);
		timesheet.setTimeSpent(LocalTime.now());
		timesheet.setUserId((long) 1);

		timesheetRepository.save(timesheet);
		
		List<Timesheet> timesheets = this.timesheetRepository.findAll();	
		assertEquals(1, timesheets.size());		
		this.timesheetRepository.delete(timesheet);

	}

}
