package tse.startuppoc.timesheets.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import tse.startuppoc.timesheets.model.Role;
import tse.startuppoc.timesheets.model.RoleName;

import java.util.Optional;

/** Role's repository which inherits from the JpaRepository
 * 
 * @author oumai
 *
 */
public interface RoleRepository extends JpaRepository<Role,Long> {
    Optional<Role> findByName(RoleName roleName);
}
