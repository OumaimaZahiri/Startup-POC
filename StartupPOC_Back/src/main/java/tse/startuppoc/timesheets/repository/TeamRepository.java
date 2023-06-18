package tse.startuppoc.timesheets.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import tse.startuppoc.timesheets.model.Team;

/** Team's repository which inherits from the JpaRepository
 * 
 * @author oumai
 *
 */
public interface TeamRepository extends JpaRepository<Team,Long> {

}
