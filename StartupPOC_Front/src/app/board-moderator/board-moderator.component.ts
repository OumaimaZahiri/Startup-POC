import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { AddMemberModal } from '../ng-material/add-member-modal/add-member-modal';
import swal from 'sweetalert2';

@Component({
  selector: 'app-board-moderator',
  templateUrl: './board-moderator.component.html',
  styleUrls: ['./board-moderator.component.css']
})
export class BoardModeratorComponent implements OnInit {
  content?: string;
  users?: any;
  manager?: any;
  tabvalue:string = "user";
  userframechange = false;
  team?: any;

  constructor(private userService: UserService, private tokenStorage: TokenStorageService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.userService.getModeratorBoard(this.tokenStorage.getUser().id).subscribe(
      data => {
        this.team = JSON.parse(data);
        this.users = JSON.parse(data).members;
        this.manager = JSON.parse(data).manager;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }
  
  openDialog() {
    const dialogRef = this.dialog.open(AddMemberModal, { panelClass: 'custom-dialog-container',data: this.team });
    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
  }

  OnUserFrameChange() {
    this.userframechange = !this.userframechange;
  }

  setTabValue(val:string):void{
    this.tabvalue=val;
  };

  deleteMember(id : number) : void {
    swal.fire({  
      title: 'Are you sure want to remove this member?',  
      text: 'He will be remove from your team',  
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Yes, remove it!',  
      cancelButtonText: 'No, keep it'  
    }).then((result) => {  
      if (result.value) {
        this.userService.deleteMember(id, this.team).subscribe(
          data => {
            console.log("func del ok");
            swal.fire(  
            'Removed!',  
            'This user  has been removed.',  
            'success'  
          )
          window.location.reload();
          },
          err => {
            console.log(JSON.parse(err.error).message);
            swal.fire(  
              'Cancelled',  
              'This user has not been removed. :)',  
              'error'  
            )  
           });
      } else if (result.dismiss === swal.DismissReason.cancel) {  
        swal.fire(  
          'Cancelled',  
          'This user has not been removed. :)',  
          'error'  
        )  
      }  
    }) 
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
