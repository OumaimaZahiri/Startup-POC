import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';
import swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css'],
  providers: [DatePipe]
})
export class BoardUserComponent implements OnInit {
  projects?: any;
  tabvalue:string = "";
  userframechange:boolean = false;
  team?: any;

  project: any = {
    id : null,
    title: null,
    description: null,
    startingDate: null,
    estimatedTime: null,
    timeSpent: null
  };

  form: any = {
    id : null,
    title: null,
    description: null,
    startingDate: null,
    estimatedTime: null,
    timeSpent: null
  };

  form_timesheet: any = {
    title: null,
    date: null,
    timeSpent: null
  };

  searchText = '';
  errorMessage = '';
  type: string = "";


  constructor(private userService: UserService, private tokenStorage: TokenStorageService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.userService.getAllProjects().subscribe(
      data => {
        this.projects = JSON.parse(data);
      },
      err => {
        console.log(JSON.parse(err.error).message);
      }
    );
  }
  
  OnUserFrameChange() {
    this.userframechange = !this.userframechange;
  }

  setTabValue(val:string):void{
    this.tabvalue=val;
  };

  setProject(val:any):void{
    this.project=val;
    this.form=val;
  };

  setTimeSheet(index:number):void{
    this.form_timesheet.title= this.projects[index].id;
    this.form_timesheet.timeSpent="07:00";
  }

  clearProject():void{
    this.form={
      id : null,
      title: null,
      description: null,
      startingDate: null,
      estimatedTime: null,
      timeSpent: null
    };
    this.project={
      id : null,
      title: null,
      description: null,
      startingDate: null,
      estimatedTime: null,
      timeSpent: null
    };
  };

  deleteProject(id : number) : void {
    swal.fire({  
      title: 'Are you sure want to remove this project?',  
      text: 'He will be remove from your project list',  
      icon: 'warning',  
      showCancelButton: true,  
      confirmButtonText: 'Yes, remove it!',  
      cancelButtonText: 'No, keep it'  
    }).then((result) => {  
      if (result.value) {
        this.userService.deleteProject(id).subscribe(
          data => {
            console.log("func del ok");
            swal.fire(  
            'Removed!',  
            'This project  has been removed.',  
            'success'  
          )  
          },
          err => {
            console.log(JSON.parse(err.error).message);
            swal.fire(  
              'Cancelled',  
              'This project has not been removed. :)',  
              'error'  
            )  
           });
      } else if (result.dismiss === swal.DismissReason.cancel) {  
        swal.fire(  
          'Cancelled',  
          'This project has not been removed. :)',  
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

  onSubmit(): void {
    if(this.tabvalue=='new_project'){
      if (this.form.timeSpent==null) {
        this.form.timeSpent=0;
      }
      const { id, title, description, startingDate, estimatedTime, timeSpent  } = this.form;
      swal.fire({  
        title: 'Are you sure want to add this project?',    
        icon: 'warning',  
        showCancelButton: true,  
        confirmButtonText: 'Yes, add it!',  
        cancelButtonText: 'No, cancel'  
      }).then((result) => {  
        if (result.value){
          this.userService.addProject_(title, description, startingDate, estimatedTime, timeSpent).subscribe(
            data => {
              swal.fire(  
              'Added!',  
              'Project has been added.',  
              'success'  
              ).then((result) => {
                window.location.reload();     
              })
            },
            err => {
              console.log(JSON.parse(err.error).message);
              swal.fire(  
                'Cancelled',  
                'Project has not been added :)',  
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
    else if (this.tabvalue=='edit'){
      swal.fire({  
        title: 'Are you sure want to edit?',    
        icon: 'warning',  
        showCancelButton: true,  
        confirmButtonText: 'Yes, edit it!',  
        cancelButtonText: 'No, cancel'  
      }).then((result) => {  
        if (result.value){
          this.userService.editProject_(this.form).subscribe(
            data => {
              swal.fire(  
              'Edited!',  
              'Project has been edited.',  
              'success'  
              ).then((result) => {this.setTabValue('projects')})
            },
            err => {
              console.log(JSON.parse(err.error).message);
              swal.fire(  
                'Cancelled',  
                'Project has not been edited :)',  
                'error'  
              )  
             });
        }
        else if (result.dismiss === swal.DismissReason.cancel) {  
          swal.fire(  
            'Cancelled',    
            'error'  
          )  
        }
      })
    }
  };

  onSubmitTimeSheet(): void {
    const { title, date, timeSpent } = this.form_timesheet;
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
