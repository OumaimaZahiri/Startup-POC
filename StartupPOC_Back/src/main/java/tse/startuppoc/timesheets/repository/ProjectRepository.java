package tse.startuppoc.timesheets.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import tse.startuppoc.timesheets.model.Project;

/** Project's repository which inherits from the JpaRepository
 * 
 * @author oumai
 *
 */
public interface ProjectRepository extends JpaRepository<Project,Long> {

}
