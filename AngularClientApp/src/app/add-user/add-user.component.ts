import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { User } from '@app/_models/user';
import { UserService } from '@app/_services';
import { UserRole } from '@app/_models/userRole';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.less']
})

export class AddUserComponent implements OnInit {

  userformlabel: string = 'Add User';
  empformbtn: string = 'Save';
  userRoles: UserRole[] = [];
  addForm: FormGroup;
  error = '';

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService) {
  }
  
  ngOnInit() {

    this.addForm = this.formBuilder.group({
      id: [],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.userService.getUserRole().pipe(first()).subscribe(userRole => {
      this.userRoles = userRole;
    });

  }
  onSubmit() {
    this.userService.createUser(this.addForm.value)
      .subscribe(data => {
        this.router.navigate(['listuser']);
      },
        error => {
          alert(error);
          this.error = error;
        });
  }
}
