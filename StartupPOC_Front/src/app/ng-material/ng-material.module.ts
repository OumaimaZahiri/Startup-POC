import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeveloperModal } from './login-modal/mat-basic.component'
import { CreateUserModal } from './create-user-modal/mat-basic.component'
import { AddMemberModal } from './add-member-modal/add-member-modal'
import { AddManagerModal } from './add-manager-modal/add-manager-modal'
import { AddPhotoModal } from './add-photo-modal/add-photo-modal';
import { ChangeRoleModal } from './change-role-modal/change-role-modal';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { FilterPipe_ } from '../pipes/filter_.pipe';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AddTimesheetModal } from './add-timesheet-modal/add-timesheet-modal';


@NgModule({
  declarations: [
    DeveloperModal,
    CreateUserModal,
    AddMemberModal,
    AddManagerModal,
    AddPhotoModal,
    ChangeRoleModal,
    LoginComponent,
    FilterPipe_,
    CreateProjectComponent,
    AddTimesheetModal
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
    ImageCropperModule
  ], exports: [
    MatDialogModule,
    MatButtonModule
  ]
})
export class NgMaterialModule { }
