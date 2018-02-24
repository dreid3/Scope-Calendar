package scopeCalendar.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import scopeCalendar.models.User;


public interface UserRepository extends JpaRepository<User, Long> {
	User findByEmailIgnoreCase(String arg0);
	User findByUsernameIgnoreCase(String arg0);
	User findByUsernameOrEmail(String arg0, String arg1);
}
