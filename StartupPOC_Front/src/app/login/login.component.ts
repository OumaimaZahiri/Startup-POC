import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;
    console.log(this.form);
    this.authService.login(username, password).subscribe(
      data => {
        if(data.status!="false" && data.data!=""){
          this.tokenStorage.saveToken(data.accessToken);
          if (data.role=="ROLE_ADMIN" || data.role=="ROLE_USER_MANAGE") {
            this.tokenStorage.saveUser({ "id":data.id, "firstname":data.firstname, "lastname":data.lastname, "email": username, "roles": data.role, "accessToken": data.accessToken, "tokenType": data.tokenType}); this.tokenStorage.savePhoto(data.photos); window.location.reload(); }
          if (data.role=="ROLE_VIEW" ) {
            this.tokenStorage.saveUser({  "id":data.id, "firstname":data.firstname, "lastname":data.lastname, "email": username, "roles": data.role });this.tokenStorage.savePhoto(data.photos); window.location.reload(); }
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.tokenStorage.getUser().roles;
        }
        else{
          this.isLoginFailed = true;
        }
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }
}
