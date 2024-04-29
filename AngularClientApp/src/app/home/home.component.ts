import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    user: User;
    userFromApi: User;
    userformlabel: string = 'Profile';

    constructor(
      private userService: UserService,
      private authenticationService: AuthenticationService,
      private formBuilder: FormBuilder,
      private router: Router
    ) {
        this.user = this.authenticationService.userValue;
    }

    editForm: FormGroup;

    ngOnInit() {
          this.loading = true;
          this.userService.getById(this.user.id).pipe(first()).subscribe(user => {
              this.loading = false;
            this.userFromApi = user;
            this.editForm.patchValue(user);
          });

      console.log("Errorrrrr")

      this.editForm = this.formBuilder.group({
        id: [],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        middleName: ['', Validators.required],
      });
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
