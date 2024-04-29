import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@app/_models/user';
import { CreateUser } from '@app/_models/createUser';
import { EditUser } from '@app/_models/editUser';
import { UserRole } from '../_models/userRole';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    deleteUser(id: string) {
      return this.http.delete<User[]>(`${environment.apiUrl}/users/${id}`);
    }

    createUser(createUser: CreateUser) {
      return this.http.post<any>(`${environment.apiUrl}/users/`, createUser);
    }

    updateUser(editUser: EditUser) {
      return this.http.put(`${environment.apiUrl}/users` + '/' + editUser.id, editUser);
    }

  getUserRole() {
    return this.http.get<UserRole[]>(`${environment.apiUrl}/dropdown/GetRoleSelectList`);
  }
}
