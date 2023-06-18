import { Component, Output, EventEmitter, Inject,Input, OnInit} from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-member-modal',
  templateUrl: './add-member-modal.html',
  styleUrls: ['./add-member-modal.css']
})
export class AddMemberModal implements OnInit {

  users?: any;
  checkboxlist?: any = [];
  cantsubmit = false;
  type: string = "";

  
  searchText = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    public dialogRef: MatDialogRef<AddMemberModal>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}


  ngOnInit() {
    this.userService.getListUsersAvailable().subscribe(
      data => {
        this.users = JSON.parse(data).data;
        for(let i=0; i < JSON.parse(data).data.length; i++ ){
          const value = JSON.parse(data).data[i];
          this.checkboxlist.push({"id":value.id, "firstname":value.firstname, "lastname":value.lastname, "check":false})
        }
      },
      err => {
        console.log(JSON.parse(err.error).message);
      }
    );
  }

  onSubmit(): void {
    swal.fire({  
      title: 'Are you sure want to save?',    
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Yes, add it!',  
      cancelButtonText: 'No, cancel'  
    }).then((result) => {  
      if (result.value){
        this.data.members = this.data.members.concat(this.checkboxlist.filter((val:any) => val.check == true));
        console.log(this.checkboxlist);
        this.data.members = this.data.members.reduce((acc:any, current:any) => {
          const x = acc.find((item:any) => item.id === current.id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        this.userService.addmembers(this.data).subscribe(
          data => {
            swal.fire(  
            'Added!',  
            'User has been added.',  
            'success'  
          )  
          this.dialogRef.close();
          },
          err => {
            console.log(JSON.parse(err.error).message);
            swal.fire(  
              'Cancelled',  
              'User has not been added :)',  
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

  onCheckboxChange(e:any) {
    if (e.target.checked) {
      this.checkboxlist[this.checkboxlist.findIndex(((val:any) => val.id == e.target.value))].check=true;
    }
    else {
       this.checkboxlist[this.checkboxlist.findIndex(((val:any) => val.id == e.target.value))].check=false;
    }
  }
}
