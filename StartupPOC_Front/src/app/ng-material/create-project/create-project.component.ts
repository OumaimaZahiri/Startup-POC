import { Component, Output, EventEmitter, Inject, OnInit} from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
import swal from 'sweetalert2';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {

  form: any = {
    id : null,
    title: null,
    description: null,
    startingDate: null,
    estimatedTime: null,
    timeSpent: null,
    managers: [],
    users: [],
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  type: string = "";
  @Output() submitClicked = new EventEmitter<any>();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    public dialogRef: MatDialogRef<CreateProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}


  ngOnInit() {
    this.type = this.data.type;
    this.form.id = this.data.id;
    this.form.title = this.data.title;   
    this.form.description = this.data.description;   
    this.form.startingDate = this.data.startingDate;
    this.form.estimatedTime = this.data.estimatedTime;
    this.form.timeSpent = this.data.timeSpent;
    this.form.managers = [];
    this.form.users = [];
  }

  onSubmit(): void {
    const { id, title, description, startingDate, estimatedTime, timeSpent, managers, users } = this.form;
    console.log( { id, title, description, startingDate, estimatedTime, timeSpent, managers, users } );
    if(this.type=='project'){
      swal.fire({  
      title: 'Are you sure want to create this project ?',  
      text: '',  
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Yes, create it!',  
      cancelButtonText: 'No, cancel'  
    }).then((result) => {  
      if (result.value) {
        this.userService.addProject(title, description, startingDate, estimatedTime.toString(), timeSpent, managers, users).subscribe(
          data => {
            swal.fire(  
            'Created!',  
            'This project  has been created.',  
            'success'  
          ) 
          this.dialogRef.close();
          },
          err => {
            console.log(JSON.parse(err.error).message);
            swal.fire(  
              'Cancelled',  
              'This project  has not been created. :)',  
              'error'  
            )  
           });
      } else if (result.dismiss === swal.DismissReason.cancel) {  
        swal.fire(  
          'Cancelled',  
          'This account  has not been created. :)',  
          'error'  
        )  
      }  
    })
    }
    else if(this.type=='edit'){
      swal.fire({  
        title: 'Are you sure want to edit this project ?',  
        text: '',  
        icon: 'warning',  
        showCancelButton: true,  
        confirmButtonText: 'Yes, edit it !',  
        cancelButtonText: 'No, cancel'  
      }).then((result) => {  
        if (result.value) {
          this.userService.editProject(title, description, startingDate, estimatedTime.toString(), timeSpent, managers, users).subscribe(
            data => {
              swal.fire(  
              'Edited!',  
              'This account  has been edited.',  
              'success'  
            )  
            this.dialogRef.close();
            },
            err => {
              console.log(JSON.parse(err.error).message);
              swal.fire(  
                'Cancelled',  
                'This account  has not been edited. :)',  
                'error'  
              )  
             });
        } 
    else if (result.dismiss === swal.DismissReason.cancel) {  
          swal.fire(  
            'Cancelled',  
            'This account  has not been edited. :)',  
            'error'  
          )  
        }  
    })}
  };
}
