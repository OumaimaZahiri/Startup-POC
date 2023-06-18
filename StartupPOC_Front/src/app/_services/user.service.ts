import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Time } from '@angular/common';
import { TokenStorageService } from './token-storage.service';

const API_URL = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) {}
  isLogged() {
    return !!this.tokenStorage.getToken();
  }
  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'user/get-all-user', { responseType: 'text' });
  }
  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user/get-all-user', { responseType: 'text' });
  }
  getModeratorBoard(id:number): Observable<any> {
    return this.http.get(API_URL + 'team/getteam/'+ id ,  { responseType: 'text' });
  }
  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'user/get-all-users', { responseType: 'text' });
  }
  getPendingAccount(): Observable<any> {
    return this.http.get(API_URL + 'user/get-all-pending-account', { responseType: 'text' });
  }
  getLockedAccount(): Observable<any> {
    return this.http.get(API_URL + 'user/get-all-locked-account', { responseType: 'text' });
  }
  getProjects(): Observable<any> {
    return this.http.get(API_URL + 'project/getprojects', { responseType: 'text' });
  }
  getProject(id: number): Observable<any> {
    return this.http.get(API_URL + 'project/getproject/' + id, { responseType: 'text' });
  }
  deleteUser(id:number): Observable<any> {
    return this.http.post(API_URL + 'user/delete', {id},  { responseType: 'text' });
  }
  addUser(firstname: string, lastname: string, email:string, password:string): Observable<any> {
    return this.http.post(API_URL + 'auth/signup', { firstname, lastname, email, password }, { responseType: 'text' });
  }
  addManager(firstname: string, lastname: string, email:string, password:string): Observable<any> {
    return this.http.post(API_URL + 'auth/signup', { firstname, lastname, email, password, "userRole":'ROLE_USER_MANAGE'}, { responseType: 'text' });
  }
  addAdmin(firstname: string, lastname: string, email:string, password:string): Observable<any> {
    return this.http.post(API_URL + 'auth/signup', { firstname, lastname, email, password, "userRole":'ROLE_ADMIN' }, { responseType: 'text' });
  }
  changeRole(id: number, id_role:number, name:string): Observable<any> {
    return this.http.post(API_URL + 'user/change_role/'+id, {"id":id_role, "name":name} , { responseType: 'text' });
  }
  addProject(title: string, description: string, startingDate:Date, estimatedTime:string, timeSpent:Time, managers:Array<any>, users:Array<any>): Observable<any> {
    return this.http.post(API_URL + 'project/createproject', { title, description, startingDate, estimatedTime, managers, users }, { responseType: 'text' });
  }
  editProject(title: string, description: string, startingDate:Date, estimatedTime:string, timeSpent:Time, managers:Array<any>, users:Array<any>): Observable<any> {
    return this.http.put(API_URL + 'project/editproject', { title, description, startingDate, estimatedTime, managers, users }, { responseType: 'text' });
  }
  deleteProject(id:number): Observable<any> {
    return this.http.delete(API_URL + 'project/'+id,  { responseType: 'text' });
  }
  editUser(id : number, firstname: string, lastname: string, email: string): Observable<any> {
    return this.http.post(API_URL + 'user/edit', { id, firstname, lastname, email }, { responseType: 'text' });
  }
  activateAccountUser(id:number): Observable<any> {
    return this.http.post(API_URL + 'user/activate_pending_account_by_id', {"id":id},  { responseType: 'text' });
  }
  unlockAccountUser(id:number): Observable<any> {
    return this.http.post(API_URL + 'user/unlock_account_by_id', {"id":id},  { responseType: 'text' });
  }
  getListUsersAvailable(): Observable<any> {
    return this.http.get(API_URL + 'user/get-all-user' ,  { responseType: 'text' });
  }
  addmembers(team:any): Observable<any> {
    return this.http.post(API_URL + 'team/addmembers', team,  { responseType: 'text' });
  }  
  changeManagerByIdUser(id:number, user:any): Observable<any> {
    return this.http.post(API_URL + 'team/change_manager/'+id, user, { responseType: 'text' });
  }
  deleteMember(id:number, team:any): Observable<any> {
    return this.http.post(API_URL + 'team/deletememberbyid/'+id, team,  { responseType: 'text' });
  }
  getAllProjects(): Observable<any> {
    return this.http.get(API_URL + 'project/getprojects' ,  { responseType: 'text' });
  }
  addProject_(title : string, description: string, startingDate: string, estimatedTime: string, timeSpent: string): Observable<any> {
    return this.http.post(API_URL + 'project/createproject', {title, description, startingDate, estimatedTime, timeSpent},  { responseType: 'text' });
  }
  editProject_(project:any): Observable<any> {
    return this.http.put(API_URL + 'project/editproject', project,  { responseType: 'text' });
  }
  getTimeSheets(id:number): Observable<any> {
    return this.http.get(API_URL + 'timesheet/gettimesheets/'+id,  { responseType: 'text' });
  }
  addTimeSheet(userId: number, projectId: number, day: string, timeSpent: string): Observable<any> {
    return this.http.post(API_URL + 'timesheet/addtimesheet', {"userId": userId, "projectId": projectId, "day": day, "timeSpent": timeSpent},  { responseType: 'text' });
  }
  deleteTimeSheet(id:string): Observable<any> {
    return this.http.delete(API_URL + 'timesheet/'+id,  { responseType: 'text' });
  }
  exportMonth(date: string, user_id:number): Observable<any> {
    return this.http.get(API_URL + 'timesheet/exportmonth?date='+date+'&user_id=' + user_id,  { responseType: 'blob' });
  }


  addImage(id:number, file:any): Observable<any> {
    // Create form data
    const formData = new FormData(); 
        
      // Store form name as "file" with file data
    formData.append("image", file);
    return this.http.post(API_URL + 'user/upload_image/'+id, formData,  { responseType: 'text' });
  }
}
