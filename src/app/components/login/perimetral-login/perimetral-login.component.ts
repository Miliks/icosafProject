/**
 * Component that manage the logic related to the perimetral login
 */
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-perimetral-login',
  templateUrl: './perimetral-login.component.html',
  styleUrls: ['./perimetral-login.component.css']
})
export class PerimetralLoginComponent implements OnInit {

  loginForm: FormGroup
  hide = true;
  @Input() error: string | null;
  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required,]), //Validators.email it should be added but for the moment both the user and password are "icosaf"
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    console.log("No");
  }

  submit() {
    if (this.loginForm.valid) {
      this.save();
    }
  }


  save() {
    /* this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(response => {
 
       console.log(response);
 
       // if (response) {
       //   var sess = {};
       //   sess["email"] = this.loginForm.value.email;
       //   localStorage.setItem("session", JSON.stringify(sess));
       // }
       // this.dialogRef.close();
 
     }, error => {
       this.error = error.error;
     })
 */

    if (this.loginForm.value.email == "icosaf" && this.loginForm.value.password == "icosaf") {
      this.router.navigate(["Home"])
    } else {
      this.error = "Username o password errati"
    }
  }

  close() {
    console.log("CLOSE");
  }
}
