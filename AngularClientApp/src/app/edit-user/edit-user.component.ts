import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { User } from '@app/_models';
import { UserService } from '@app/_services';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.less']
})
export class EditUserComponent implements OnInit {

  userformlabel: string = 'Edit User';
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService) {
  }

  editForm: FormGroup;
  ngOnInit() {

    this.editForm = this.formBuilder.group({
      id: [],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: ['', Validators.required],
    });

    let userid = localStorage.getItem('id');
    if (userid != null && userid != "") {
      this.userService.getById(userid).subscribe(data => {
        this.editForm.patchValue(data);
      })
      this.userformlabel = 'Edit User';
    }
  }
  onUpdate() {
    this.userService.updateUser(this.editForm.value).subscribe(data => {
      this.router.navigate(['listuser']);
    },
      error => {
        alert(error);
      });
  }
}
