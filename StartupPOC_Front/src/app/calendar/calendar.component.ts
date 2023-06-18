import { Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, Calendar } from '@fullcalendar/core';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { EventInput } from '@fullcalendar/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTimesheetModal } from '../ng-material/add-timesheet-modal/add-timesheet-modal';
import { ActivatedRoute,ParamMap  } from '@angular/router';
import { map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  providers: [DatePipe]
})
export class CalendarComponent {
  @ViewChild('calendar')
  calendar!: FullCalendarComponent;
  
  calendarVisible = true;
  private calendarApi!: Calendar;
  events : EventInput[] = [] ;
  currentDate!: Date;
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'exportMonth,dayGridMonth,listMonth'
    },
    customButtons: {
      exportMonth: {
        text: 'export',
        click: this.exportCurrentMonth.bind(this),
      }
    },
    initialView: 'dayGridMonth',
    initialEvents: [],
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };
  currentEvents: EventApi[] = [];
  id:number = -1;

constructor(private tokenStorage: TokenStorageService, 
              private userService: UserService, 
              private changeDetector: ChangeDetectorRef, 
              public dialog: MatDialog, 
              private route: ActivatedRoute, 
              private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      map((params: ParamMap) => params.get('id')),
    ).subscribe(param => {
      if(Number(param)){
        this.id = Number(param)
      }
      else{
        this.id=this.tokenStorage.getUser().id
      }
    });
    this.userService.getTimeSheets(this.id).subscribe(
      data => {
        var events = JSON.parse(data);
        var init_events = [];
        for(let i=0; i<events.length; i++){
          init_events.push({
            id: events[i].id,
            projectId : events[i].projectId,
            timSpent:events[i].timSpent,
            title: "Projet " + events[i].projectId + " | time : " + events[i].timSpent,
            start: events[i].day
          })
        }
        this.events = init_events;
      },
      err => {
        console.log(err.error.message);
      }
    );
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.calendarApi = this.calendar.getApi();
      let calendarTitle = this.calendarApi.view.title;
      this.currentDate = new Date(calendarTitle);
      this.currentDate.setDate(this.currentDate.getDate() + 1);
  });
  }

  exportCurrentMonth() {
    console.log(this.currentDate);
    swal.fire({  
      title: 'Are you sure want to export this month ?',    
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Yes, export it!',  
      cancelButtonText: 'No, cancel'  
    }).then((result) => {  
      if (result.value){    
        this.userService.exportMonth(this.currentDate.toISOString().substr(0, 10), this.tokenStorage.getUser().id).subscribe(
          data => {
            swal.fire(  
            'Exported!',  
            'This month has been exported.',  
            'success'  
            ).then((result) => {
              const file=new Blob([data], {type:'application/pdf'});
              const link = document.createElement('a');
              link.href = window.URL.createObjectURL(file);
              link.download = 'timesheets_review_' + this.datePipe.transform(this.currentDate, 'MM/y') + '.pdf';
              link.click();
            })
        },
          err => {
            console.log(JSON.parse(err.error).message);
            swal.fire(  
              'Cancelled',  
              'Month has not been exported :)',  
              'error'  
            )  
           });
      } else if (result.dismiss === swal.DismissReason.cancel) {  
        swal.fire(  
          'Cancelled',    
          'error'  
        )  
      }
    })
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
    this.openDialog(selectInfo.startStr);
  }

  handleEventClick(clickInfo: EventClickArg) {
    swal.fire({  
      title: `Are you sure you want to delete the event '${clickInfo.event.title}'`,  
      text: 'It will be removed from your timesheets',  
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Yes, remove it!',  
      cancelButtonText: 'No, keep it'  
    }).then((result) => {  
      if (result.value) {
        this.userService.deleteTimeSheet(clickInfo.event.id).subscribe(
          data => {
            swal.fire(  
            'Removed!',  
            'This timesheet has been removed.',  
            'success'  
            ) 
            clickInfo.event.remove(); 
          },
          err => {
            console.log(JSON.parse(err.error).message);
            swal.fire(  
              'Cancelled',  
              'This timesheet has not been removed. :)',  
              'error'  
            )  
           });
      } else if (result.dismiss === swal.DismissReason.cancel) {  
        swal.fire(  
          'Cancelled',  
          'This timesheet has not been removed. :)',  
          'error'  
        )  
      }  
    })
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
    setTimeout(() => {
      this.calendarApi = this.calendar.getApi();
      let calendarTitle = this.calendarApi.view.title;
      this.currentDate = new Date(calendarTitle);
      this.currentDate.setDate(this.currentDate.getDate() + 1);
  });
  }

  openDialog(date:string) {
    const dialogRef = this.dialog.open(AddTimesheetModal, { panelClass: 'custom-dialog-container', data:{"id":this.id, "date":date} });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
