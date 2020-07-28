import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  loggedIn: boolean;
  submitted = false;
	incorrectInfo = false;

	constructor(
		private httpService: HttpService,
		private formBuilder: FormBuilder,
	) { }

	ngOnInit() {
	  this.loggedIn = true;
	  this.loginForm = this.formBuilder.group({
	    username: ['', Validators.required],
	    password: ['', Validators.required],
	  });

	  /*if (this.httpService.currentUserValue){
	    this.loggedIn = true;
	  }*/
	}

	get form() { return this.loginForm.controls; }

	onSubmit() {
	  this.submitted = true;

	  if (this.loginForm.invalid) {
	    return;
	  }
	  this.loading = true;

		this.loggedIn = this.httpService.login(this.loginForm)
		console.log(this.loggedIn);
		if(this.loggedIn == false){
			this.incorrectInfo = true;
			this.loading = false;			
		}
	}
}
