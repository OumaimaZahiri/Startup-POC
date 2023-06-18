package tse.startuppoc.timesheets.model;
import org.hibernate.annotations.NaturalId;

import javax.persistence.*;

/** Table to manage the users' roles
 * the only two columns are the user's id
 * and the role he has 
 * @author oumai
 *
 */
@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    @NaturalId
    @Column(length = 60)
    private RoleName name;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public RoleName getName() {
        return name;
    }

    public void setName(RoleName name) {
        this.name = name;
    }
}
