import { Component, Output, EventEmitter, Inject,Input, OnInit} from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ImageCroppedEvent, base64ToFile  } from 'ngx-image-cropper';
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-photo-modal',
  templateUrl: './add-photo-modal.html',
  styleUrls: ['./add-photo-modal.css']
})
export class AddPhotoModal implements OnInit {

  photos: any ="";
  @Output() submitClicked = new EventEmitter<any>();

  // Variable to store shortLink from api response
  id:number = 0;
  shortLink: string = "";
  loading: boolean = false; // Flag variable
  file: any = null; // Variable to store file
  imgChangeEvt: any = '';
  cropImgPreview: any = '';

  constructor(
    private userService: UserService,
    private tokenStorage: TokenStorageService,
    public dialogRef: MatDialogRef<AddPhotoModal>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}


  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.id = this.tokenStorage.getUser().id;
    }
  }

  
  // On file Select
  onChange(event:any) {
      this.file = event.target.files[0];
      console.log(event);
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
            this.loading = !this.loading;
            console.log(this.file)
            this.userService.addImage(this.id, this.file).subscribe(
                data => {
                  swal.fire(  
                  'Uploaded!',  
                  'This image  has been uploaded.',  
                  'success'  
                )           
                  // Short link via api response
                  this.shortLink = data.link;
                  this.loading = false; // Flag variable
                  this.tokenStorage.savePhoto("/user-photos/"+this.tokenStorage.getUser().id+"/"+this.imgChangeEvt.target.files[0].name);
                  window.location.reload();
                },
                err => {
                  console.log(JSON.parse(err.error).message);
                  swal.fire(  
                    'Cancelled',  
                    'This project has not been uploaded. :)',  
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
    this.dialogRef.close();
  };

  onFileChange(event: any): void {
      this.imgChangeEvt = event;
  }

  cropImg(e: ImageCroppedEvent) {
    // Preview
    this.cropImgPreview = e.base64;
    const fileToReturn = this.base64ToFile(
      e.base64,
      this.imgChangeEvt.target.files[0].name,
    )

    this.file =  fileToReturn;
  }


  base64ToFile(data:any, filename:any) {

    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  imgLoad() {
      // display cropper tool
  }
  initCropper() {
      // init cropper
  }
    
  imgFailed() {
      // error msg
  }

}
