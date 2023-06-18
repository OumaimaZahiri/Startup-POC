import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserModal } from '../ng-material/create-user-modal/mat-basic.component';
import { ChangeRoleModal } from '../ng-material/change-role-modal/change-role-modal';
import { AddManagerModal } from '../ng-material/add-manager-modal/add-manager-modal'
import swal from 'sweetalert2';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {
  users?: any;
  pendingaccounts?: any;
  lockedaccounts?: any;
  tabvalue:string = "user";
  userframechange = false;

  constructor(private userService: UserService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.userService.getAdminBoard().subscribe(
      data => {
        this.users = JSON.parse(data).data;
      },
      err => {
        this.users = JSON.parse(err.error).message;
      }
    );
    this.userService.getPendingAccount().subscribe(
      data => {
        this.pendingaccounts = JSON.parse(data).data;
      },
      err => {
        this.pendingaccounts = JSON.parse(err.error).message;
      }
    );
    this.userService.getLockedAccount().subscribe(
      data => {
        this.lockedaccounts = JSON.parse(data).data;;
      },
      err => {
        this.lockedaccounts = JSON.parse(err.error).message;
      }
    );
  };

  openDialog() {
    const dialogRef = this.dialog.open(CreateUserModal, { panelClass: 'custom-dialog-container',data: {type: this.tabvalue} });
    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
  }

  changeRoleDialog(id:number) {
    const dialogRef = this.dialog.open(ChangeRoleModal, { panelClass: 'custom-dialog-container',data: id });
    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
  }

  addManagerDialog(id:number) {
    const dialogRef = this.dialog.open(AddManagerModal, { panelClass: 'custom-dialog-container',data: {id:id, managers:this.users[1]}});
    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
  }


  OnUserFrameChange() {
    this.userframechange = !this.userframechange;
  }

  deleteUser(id : number) : void {
    swal.fire({  
      title: 'Are you sure want to remove?',  
      text: 'You will not be able to recover this user!',  
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Yes, delete it!',  
      cancelButtonText: 'No, keep it'  
    }).then((result) => {  
      if (result.value) {
        this.userService.deleteUser(id).subscribe(
          data => {
              swal.fire(  
                'Deleted!',  
                'This user  has been deleted.',  
                'success'  
              );
              window.location.reload();
          },
          err => {
            console.log(JSON.parse(err.error).message);
            swal.fire(  
              'Cancelled',  
              'This user has not been deleted. :)',  
              'error'  
            )  
           });
      } else if (result.dismiss === swal.DismissReason.cancel) {  
        swal.fire(  
          'Cancelled',  
          'This user has not been deleted. :)',  
          'error'  
        )  
      }  
    }) 
  };

  editUser(id:number, firstname: string, lastname: string, email: string): void {
    const dialogRef = this.dialog.open(CreateUserModal, { panelClass: 'custom-dialog-container',data: {type: "edit",id:id,firstname:firstname,lastname:lastname,email:email} });
    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
  }

  activateAccountUser(id : number) : void {
    swal.fire({  
      title: 'Are you sure want to activate?',  
      text: '',  
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Yes, activate it!',  
      cancelButtonText: 'No, cancel'  
    }).then((result) => {  
      if (result.value) {
        this.userService.activateAccountUser(id).subscribe(
          data => {
            swal.fire(  
            'Activated!',  
            'This account  has been activated.',  
            'success'  
          );
          window.location.reload();
          },
          err => {
            console.log(JSON.parse(err.error).message);
            swal.fire(  
              'Cancelled',  
              'This account  has not been activated. :)',  
              'error'  
            )  
           });
      } else if (result.dismiss === swal.DismissReason.cancel) {  
        swal.fire(  
          'Cancelled',  
          'This account  has not been activated. :)',  
          'error'  
        )  
      }  
    })
  };

  unlockAccountUser(id : number) : void {
    swal.fire({  
      title: 'Are you sure want to unlock?',  
      text: '',  
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Yes, unlock it!',  
      cancelButtonText: 'No, cancel'  
    }).then((result) => {  
      if (result.value) {
        this.userService.unlockAccountUser(id).subscribe(
          data => {
            swal.fire(  
            'Unlocked!',  
            'This account  has been unlocked.',  
            'success'  
            );
            window.location.reload();
          },
          err => {
            console.log(JSON.parse(err.error).message);
            swal.fire(  
              'Cancelled',  
              'This account  has not been unlocked. :)',  
              'error'  
            )  
           });
      } else if (result.dismiss === swal.DismissReason.cancel) {  
        swal.fire(  
          'Cancelled',  
          'This account  has not been unlocked. :)',  
          'error'  
        )  
      }  
    })
  };

  setTabValue(val:string):void{
    this.tabvalue=val;
  };

 
  //func to sort array
  sort_by_name_descending(tab:any) : any {
    tab.sort(function(a : any, b:any) {
        const nameA = a.lastname.toUpperCase(); // ignore upper and lowercase
        const nameB = b.lastname.toUpperCase(); // ignore upper and lowercase
        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      });
      return tab
  }

  sort_by_name_ascending(tab:any) : any {
    tab.sort(function(a : any, b:any) {
        const nameA = a.lastname.toUpperCase(); // ignore upper and lowercase
        const nameB = b.lastname.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      });
      return tab
  }

  
  sortbyname(tab:any): void {
    let button = document.getElementById("options-menu")!.childNodes[0].nodeValue;
    if (button == "Descending") {
      tab= this.sort_by_name_ascending(tab);
      document.getElementById("options-menu")!.childNodes[0].nodeValue = "Ascending";
    } else {
      tab= this.sort_by_name_descending(tab);
      document.getElementById("options-menu")!.childNodes[0].nodeValue = "Descending";
    }
  };

}
