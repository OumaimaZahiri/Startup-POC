import { Component, Output, EventEmitter, Inject,Input, OnInit} from '@angular/core';
import { UserService } from '../../_services/user.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
import swal from 'sweetalert2';

@Component({
  selector: 'app-change-role-modal',
  templateUrl: './change-role-modal.html',
  styleUrls: ['./change-role-modal.css']
})
export class ChangeRoleModal implements OnInit {

  form: any = {
    role : null
  }

  role_id:number = 3;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<ChangeRoleModal>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}


  ngOnInit() {
    this.form.role = "ROLE_VIEW";
    this.role_id = 3;
  }

  onSubmit(): void {
    console.log(this.form.role)
    swal.fire({  
      title: 'Are you sure want to save?',    
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Yes, add it!',  
      cancelButtonText: 'No, cancel'  
    }).then((result) => {  
      if (result.value){
        if(this.form.role=="ROLE_ADMIN"){
            this.role_id = 1;
        }
        else if(this.form.role=="ROLE_USER_MANAGE"){
          this.role_id = 2;
        }
        else{
          this.role_id = 3;
        }
        this.userService.changeRole(this.data, this.role_id, this.form.role).subscribe(
          data => {
            swal.fire(  
            'Changed!',  
            'User role has been changed.',  
            'success'  
          )  
          this.dialogRef.close();
          },
          err => {
            console.log(JSON.parse(err.error).message);
            swal.fire(  
              'Cancelled',  
              'User role has not been changed :)',  
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
  };
}
