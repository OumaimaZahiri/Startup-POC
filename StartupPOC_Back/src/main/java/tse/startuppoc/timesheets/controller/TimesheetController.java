package tse.startuppoc.timesheets.controller;

import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.sql.Date;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;

import tse.startuppoc.timesheets.model.Export;
import tse.startuppoc.timesheets.model.Timesheet;
import tse.startuppoc.timesheets.payload.ApiResponse;
import tse.startuppoc.timesheets.repository.ExportRepository;
import tse.startuppoc.timesheets.repository.ProjectRepository;
import tse.startuppoc.timesheets.repository.TimesheetRepository;
import tse.startuppoc.timesheets.repository.UserRepository;

/** Class managing the timesheets' routes
 * 
 */
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/timesheet")
public class TimesheetController {
	@Autowired
    AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

    @Autowired
    TimesheetRepository timesheetRepository;

    @Autowired 
    ExportRepository exportRepository;

    @Autowired 
    ProjectRepository projectRepository;
    
    List<String> projects = new ArrayList<String>();
    
    List<String> timesheetsPerMonth = new ArrayList<String>(); 

    SimpleDateFormat monthYearFormat = new SimpleDateFormat("MM/yy");
    
    SimpleDateFormat literalMonthFormat =  new SimpleDateFormat("MMMM - yyyy");
    
    SimpleDateFormat dayFormat = new SimpleDateFormat("E dd/MM/yyyy");
    
    SimpleDateFormat sqlFormat = new SimpleDateFormat("yyyy-MM-dd");
    
    /* Route to get all the timesheets of a certain user with user_id as id
     */
	@GetMapping(value = "/gettimesheets/{user_id}")
	public List<Timesheet> getAllTimesheets(@PathVariable long user_id){
		return timesheetRepository.findByUser(user_id);
	}

	/* Route to add a new timesheet
	 */
	@PostMapping("/addtimesheet")
	public ResponseEntity<?> saveTimesheet(@Valid @NotNull @RequestBody Timesheet timesheet ){
        
		/* Before adding any timesheet for a certain month, we should first check if the month has already been
		 * exported by the user, in which case, the user could just consult the timesheets of the said month.
		 */
		if (this.exportRepository.countByMonthAndUser(this.monthYearFormat.format(timesheet.getDay()), timesheet.getUserId())!=0)
				{
					return ResponseEntity.ok(new ApiResponse(false,"","Exported month"));
				}
		
		/* Before adding a new timesheet, it's better to check whether or not the user has already entered 
		 * a timesheet for the same day and the same project, if so, he wouldn't be able to add a new one.
		 */
		for (Timesheet existingTimesheet : timesheetRepository.findAll())
		{
			if((existingTimesheet.getDay().equals(timesheet.getDay())) 
					&& (existingTimesheet.getUserId() == timesheet.getUserId())
					&& (existingTimesheet.getProjectId() == timesheet.getProjectId()))
					{
						return ResponseEntity.ok(new ApiResponse(false,"","This timesheet already exists"));
					}
		}
		timesheetRepository.save(timesheet);
		return ResponseEntity.ok(timesheet);
	};
	
	@PutMapping("/edittimesheet")
	public Timesheet updateTimesheet(@Valid @NotNull @RequestBody Timesheet timesheet ){
		return timesheetRepository.save(timesheet);
	};

	  @GetMapping(value="/exportmonth")
	  public ResponseEntity<byte[]> downloadPdf(
			    @RequestParam("date") Date date,
			    @RequestParam("user_id") long user_id) {
	    try {
	        ByteArrayOutputStream baos = new ByteArrayOutputStream();

	        PdfDocument pdf = new PdfDocument(new PdfWriter(baos));

	        Document document = new Document(pdf);

            PdfFont font = PdfFontFactory.createFont("Times-Roman");
            Paragraph title = new Paragraph(this.literalMonthFormat.format(date))
                .setFont(font)
                .setFontSize(24);
            document.add(title);
            
	        // Get the projects the user has spent time on during the corresponding month to only put these projects in the grid
            this.projects.clear();
	        List<Long> projectsId = this.timesheetRepository.projectsByMonthAndUser(this.monthYearFormat.format(date), user_id);
		    for (int i = 0; i < projectsId.size(); i++) {
		    	this.projects.add(this.projectRepository.getOne(projectsId.get(i)).getTitle());
		    }
	
		    // Column headers
	        Table table = new Table(UnitValue.createPercentArray(this.projects.size()+1)).useAllAvailableWidth();
	        table.addHeaderCell("Project");
	        for (int i=0; i<this.projects.size(); i++) {
	        	table.addHeaderCell(this.projects.get(i));
	        }
	        
	  		Calendar calendar = Calendar.getInstance();
	  		calendar.setTime(date);
	  	    calendar.set(Calendar.DAY_OF_MONTH, 1);
	  	    int maximumDays = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
	  	    
	  	    for (int day = 1; day <= maximumDays; day++) {
	  	    	
	  	    	// Add a row's header to the grid with the day of the month
		      table.addCell(dayFormat.format(calendar.getTime()));
		      
		      // Add the time spent by the user for each and every project for that specific day
	  	      for (int i=0; i<projectsId.size(); i++) {
	  	    	  if(this.timesheetRepository.findTimeSpentPerDayAndProject(
	  	    			  this.sqlFormat.format(calendar.getTime()), 
	  	    			  projectsId.get(i), 
	  	    			  user_id)!=null) {
	  	    		table.addCell(this.timesheetRepository.findTimeSpentPerDayAndProject(
	  	    				this.sqlFormat.format(calendar.getTime()), 
	  	    				projectsId.get(i), 
	  	    				user_id)
	  	    				.toString());
	  	    	  }
	  	    	  else {
	  	    		  table.addCell("0");
	  	    	  }
	  	      }
	  	      
	  	      // Increments the days
	  	      calendar.add(Calendar.DAY_OF_MONTH, 1);
	  	    }
	  		
	        document.add(table);
	        document.close();
	
		    // Return the PDF file in the response
		    byte[] pdfData = baos.toByteArray();
		    HttpHeaders headers = new HttpHeaders();
		    headers.setContentType(MediaType.APPLICATION_PDF);
		    headers.setContentLength(pdfData.length);
		    headers.setContentDispositionFormData("attachment", "timesheetsReview" + this.monthYearFormat.format(date) +  ".pdf");
		      
		    // Add the month to the exportedMonths table
		    Export monthToExport = new Export();
		    monthToExport.setMonth(this.monthYearFormat.format(date));
		    monthToExport.setUser(this.userRepository.getOne(user_id));
		    this.exportRepository.save(monthToExport);
		      
		    return ResponseEntity.ok().headers(headers).body(pdfData);
		  } catch (Exception e) {
		    e.printStackTrace();
		    return ResponseEntity.badRequest().build();
		  }
	  }
	
	@DeleteMapping(value= "/{id}")
	public void deleteTimesheet(@PathVariable long id ){
		timesheetRepository.deleteById(id);
	};
}


