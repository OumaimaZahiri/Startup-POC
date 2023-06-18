import { Component, Output, EventEmitter, Inject, OnInit} from '@angular/core';
import { UserService } from '../../_services/user.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
import swal from 'sweetalert2';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './mat-basic.component.html'
})
export class CreateUserModal implements OnInit {

  form: any = {
    id : null,
    firstname: null,
    lastname: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  type: string = "";
  @Output() submitClicked = new EventEmitter<any>();

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<CreateUserModal>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}


  ngOnInit() {
    this.type = this.data.type;
    this.form.id = this.data.id;
    this.form.firstname = this.data.firstname;   
    this.form.lastname = this.data.lastname;   
    this.form.email = this.data.email;
  }

  onSubmit(): void {
    const { id, firstname, lastname, email, password } = this.form;
    if(this.type=='manager'){
      swal.fire({  
      title: 'Are you sure want to create Manage user ?',  
      text: '',  
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Yes, create it!',  
      cancelButtonText: 'No, cancel'  
    }).then((result) => {  
      if (result.value) {
        this.userService.addManager(firstname, lastname, email, password).subscribe(
          data => {
            swal.fire(  
            'Created!',  
            'This account  has been created.',  
            'success'  
          )
          this.dialogRef.close();  
          },
          err => {
            console.log(JSON.parse(err.error).message);
            swal.fire(  
              'Cancelled',  
              'This account  has not been created. :)',  
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
    else if(this.type=='admin'){
      swal.fire({  
      title: 'Are you sure want to create Admin user ?',  
      text: '',  
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Yes, create it!',  
      cancelButtonText: 'No, cancel'  
    }).then((result) => {  
      if (result.value) {
        this.userService.addAdmin(firstname, lastname, email,password).subscribe(
          data => {
            swal.fire(  
            'Created!',  
            'This account  has been created.',  
            'success'  
          )  
          this.dialogRef.close();
          },
          err => {
            console.log(JSON.parse(err.error).message);
            swal.fire(  
              'Cancelled',  
              'This account  has not been created. :)',  
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
    else if(this.type=='user'){
      swal.fire({  
        title: 'Are you sure want to create User ?',  
        text: '',  
        icon: 'warning',  
        showCancelButton: true,  
        confirmButtonText: 'Yes, create it!',  
        cancelButtonText: 'No, cancel'  
      }).then((result) => {  
        if (result.value) {
          this.userService.addUser(firstname, lastname, email, password).subscribe(
            data => {
              swal.fire(  
              'Created!',  
              'This account  has been created.',  
              'success'  
            );     
            this.dialogRef.close();
            },
            err => {
              console.log(JSON.parse(err.error).message);
              swal.fire(  
                'Cancelled',  
                'This account  has not been created. :)',  
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
        title: 'Are you sure want to edit user informations ?',  
        text: '',  
        icon: 'warning',  
        showCancelButton: true,  
        confirmButtonText: 'Yes, edit it!',  
        cancelButtonText: 'No, cancel'  
      }).then((result) => {  
        if (result.value) {
          this.userService.editUser(id, firstname, lastname, email).subscribe(
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
        } else if (result.dismiss === swal.DismissReason.cancel) {  
          swal.fire(  
            'Cancelled',  
            'This account  has not been edited. :)',  
            'error'  
          )  
        }  
    })
    }
  };
}
