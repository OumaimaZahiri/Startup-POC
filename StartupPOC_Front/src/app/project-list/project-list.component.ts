import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectComponent } from '../ng-material/create-project/create-project.component';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html'
})
export class ProjectListComponent implements OnInit {
  isLoggedIn = false;
  projects: any;
  tabvalue:string = "project";
  isAdmin = false;
  isManager = false;
  public roles: string[] = [];

  constructor(private userService: UserService, private tokenStorage: TokenStorageService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();
    this.userService.getProjects().subscribe(
      data => {
        this.projects = JSON.parse(data);
      }
    )

    
    if (this.isLoggedIn) {
      const user = this.tokenStorage.getUser();
      this.roles = user.roles;

      this.isAdmin = this.roles.includes('ROLE_ADMIN');
      this.isManager = this.roles.includes('ROLE_USER_MANAGE');
    }
    console.log(this.tokenStorage.getToken());
  }

  setTabValue(val:string):void{
    this.tabvalue=val;
  };
  
  openDialog() {
    const dialogRef = this.dialog.open(CreateProjectComponent, { panelClass: 'custom-dialog-container',data:  {type: this.tabvalue} });
    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
  }

  //func to sort array
  sort_by_name_descending(tab:any) : any {
    tab.sort(function(a : any, b:any) {
        const nameA = a.title.toUpperCase(); // ignore upper and lowercase
        const nameB = b.title.toUpperCase(); // ignore upper and lowercase
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
        const nameA = a.title.toUpperCase(); // ignore upper and lowercase
        const nameB = b.title.toUpperCase(); // ignore upper and lowercase
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

  
  deleteProject(id : number) : void {
    swal.fire({  
      title: 'Are you sure want to remove?',  
      text: 'You will not be able to recover this project!',  
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Yes, delete it!',  
      cancelButtonText: 'No, keep it'  
    }).then((result) => {  
      if (result.value) {
        this.userService.deleteProject(id).subscribe(
          data => {
            console.log("func del ok");
            swal.fire(  
            'Deleted!',  
            'This project  has been deleted.',  
            'success'  
          );
          window.location.reload();
          },
          err => {
            console.log(JSON.parse(err.error).message);
            swal.fire(  
              'Cancelled',  
              'This project has not been deleted. :)',  
              'error'  
            )  
           });
      } else if (result.dismiss === swal.DismissReason.cancel) {  
        swal.fire(  
          'Cancelled',  
          'This project has not been deleted. :)',  
          'error'  
        )  
      }  
    }) 
  };

  editProject(title: string, description: string, startingDate: Date, estimatedTime: Date, timeSpent: Date, managers: Array<any>, users: Array<any>): void {
    const dialogRef = this.dialog.open(CreateProjectComponent, { panelClass: 'custom-dialog-container',data: {type: "edit",title:title, description: description, startingDate:startingDate, estimatedTime: estimatedTime, timeSpent: timeSpent, managers: managers, users: users} });
    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
  }
}
