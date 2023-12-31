package tse.startuppoc.timesheets;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@PropertySource(value = "file:config/application.properties")
public class UsermanageApplication {

	public static void main(String[] args) {
		SpringApplication.run(UsermanageApplication.class, args);
		System.out.println("<<<<<<<<<<<<<<<<< Application Start >>>>>>>>>>>>>>>>>>");
	}

}
