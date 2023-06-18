import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { DeveloperModal } from '../ng-material/login-modal/mat-basic.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  content?: string;

  constructor(private userService: UserService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.userService.getPublicContent().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }

  openDialog() {
    const dialogRef = this.dialog.open(DeveloperModal, { panelClass: 'custom-dialog-container' });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
