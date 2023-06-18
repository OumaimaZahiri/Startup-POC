import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TokenStorageService } from '../_services/token-storage.service';
import { AddPhotoModal } from '../ng-material/add-photo-modal/add-photo-modal';

@Component({
  selector: '[app-sidebar]',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {


  isLoggedIn = false;
  roles: string = "";
  lastname : string = "";
  firstname : string = "";
  photos: string = "";

  constructor(private tokenStorage: TokenStorageService, public dialog: MatDialog) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      this.firstname = this.tokenStorage.getUser().firstname;
      this.lastname = this.tokenStorage.getUser().lastname;
      this.photos = this.tokenStorage.getPhoto();
    }
  }
  openDialog() {
    const dialogRef = this.dialog.open(AddPhotoModal, { panelClass: 'custom-dialog-container'});
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
