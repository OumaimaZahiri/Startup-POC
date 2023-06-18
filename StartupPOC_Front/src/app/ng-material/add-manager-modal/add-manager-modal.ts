import { Component, Output, EventEmitter, Inject,Input, OnInit} from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-manager-modal',
  templateUrl: './add-manager-modal.html',
  styleUrls: ['./add-manager-modal.css']
})
export class AddManagerModal implements OnInit {

  users?: any;
  cantsubmit = false;
  type: string = "";

  
  searchText = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    public dialogRef: MatDialogRef<AddManagerModal>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}


  ngOnInit() {
    this.users = this.data.managers;
  }

  onSubmit(user:any): void {
    console.log(this.data.id);
    console.log(user);
    swal.fire({  
      title: 'Are you sure want to assign this user to this manager ?',    
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Yes, add it!',  
      cancelButtonText: 'No, cancel'  
    }).then((result) => {  
      if (result.value){
        this.userService.changeManagerByIdUser(this.data.id, user).subscribe(
          data => {
            swal.fire(  
            'Added!',  
            'User has been assigned.',  
            'success'  
          )  
          this.dialogRef.close();
          },
          err => {
            console.log(JSON.parse(err.error).message);
            swal.fire(  
              'Cancelled',  
              'User has not been assigned :)',  
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
