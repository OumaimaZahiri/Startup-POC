package tse.startuppoc.timesheets.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import tse.startuppoc.timesheets.model.Export;

/** Repository of the exported months which inherits from the JpaRepository
 * 
 * @author oumai
 *
 */
public interface ExportRepository extends JpaRepository<Export,Long> {

	/* Function whose main goal is to check if the month has been exported by the user or not
	 * 
	 * @return 0 if the month doesn't exist in the database for the specific user, which means it's not exported
	 * and 1 if it's been exported
	 */
    @Query(value = "SELECT COUNT(*) FROM exported_months arp WHERE arp.month=?1 AND arp.user_id=?2", nativeQuery = true)
    Long countByMonthAndUser(String month, Long id);
}
