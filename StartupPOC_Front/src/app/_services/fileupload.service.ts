import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
    
  constructor(private http:HttpClient) { }
  
  // Returns an observable
  upload(id:number, file:any):Observable<any> {
  
      // Create form data
      const formData = new FormData(); 
        
      // Store form name as "file" with file data
      formData.append("image", file, file.name);

      console.log(formData);
      // Make http post request over api
      // with formData as req
      return this.http.post("http://localhost:8080/api/user/upload_image/"+id, formData)
  }
}
