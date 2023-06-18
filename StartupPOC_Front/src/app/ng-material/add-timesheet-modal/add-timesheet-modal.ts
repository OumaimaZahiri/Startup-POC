import { Component, Output, EventEmitter, Inject, OnInit} from '@angular/core';
import { UserService } from '../../_services/user.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
import swal from 'sweetalert2';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-add-timesheet-modal',
  templateUrl: './add-timesheet-modal.html',
  styleUrls: ['./add-timesheet-modal.css']
})
export class AddTimesheetModal implements OnInit {

  form: any = {
    title: null,
    date: null,
    timeSpent: null
  };
  id:any;
  projects?:any;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  type: string = "";
  @Output() submitClicked = new EventEmitter<any>();

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<AddTimesheetModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tokenStorage: TokenStorageService) {}


  ngOnInit() {
    this.id = this.data.id
    this.form.date = this.data.date;
    this.form.timeSpent = "07:00:00";
    this.userService.getAllProjects().subscribe(
      data => {
        this.projects = JSON.parse(data);
      },
      err => {
        console.log(JSON.parse(err.error).message);
      }
    );
  }

  onSubmit(): void {
    const { title, date, timeSpent } = this.form;
    swal.fire({  
      title: 'Are you sure want to add this timesheet ?',  
      text: '',  
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Yes, add it!',  
      cancelButtonText: 'No, cancel'  
    }).then((result) => {  
      if (result.value) {
        this.userService.addTimeSheet(this.tokenStorage.getUser().id,title,date,timeSpent).subscribe(
          data => {
            if(JSON.parse(data).message=="Exported month"){
              swal.fire(  
                'Cancelled',  
                'This month has been exported. :)',  
                'error'  
              )  
          }
          else if( JSON.parse(data).message=="This timesheet already exists"){
            swal.fire(  
              'Cancelled',  
              'This timesheet already exists. :)',  
              'error'  
            )  
          }
            else {  
            swal.fire(  
              'Added!',  
              'This timesheet has been added.',  
              'success'  
              ) 
            }
          }
    )} else if (result.dismiss === swal.DismissReason.cancel) {  
        swal.fire(  
          'Cancelled',  
          'This timesheet has not been created. :)',  
          'error'
        )    
      }  
    })
  };
}
