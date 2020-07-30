import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../services';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css',	'../app.component.css']
})
export class InputComponent implements OnInit {

	isAdmin = true;
  inputForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
		private formBuilder: FormBuilder,
    private http: HttpService
	) { }

  ngOnInit(): void {
		this.inputForm = this.formBuilder.group({
      drink0: ["Crown Royal", Validators.required],
			pourAmt0: [null],
      drink1: ["Agave Syrup", Validators.required],
			pourAmt1: [null],
      drink2: ["Coca-Cola", Validators.required],
			pourAmt2: [null],
      drink3: ["Tofino Gin", Validators.required],
			pourAmt3: [null],
      drink4: ["Soda Water", Validators.required],
			pourAmt4: [null],
      drink5: ["Lemon Juice", Validators.required],
			pourAmt5: [null],
			mix: [0]
    });

    this.getDrinkOptions();
    this.isAdmin = this.http.currentUserValue.isAdmin;
  }

	getDrinkOptions() {
		this.http.httpRequestNoForm('mixerControl', 'GetDrinkOptions')
      .subscribe(
				response => {
					this.inputForm.patchValue({ 
						drink0: response.drink0,
			      drink1: response.drink1,
			      drink2: response.drink2,
			      drink3: response.drink3,
			      drink4: response.drink4,
			      drink5: response.drink5,
			      mix: response.mix
					});
				},
        err => {	},
        () => {}
      )
	}

	setDrinkOptions() {
		if (this.inputForm.controls.pourAmt0 == null || this.inputForm.controls.pourAmt1 == null ||
				this.inputForm.controls.pourAmt2 == null || this.inputForm.controls.pourAmt3 == null ||
				this.inputForm.controls.pourAmt4 == null || this.inputForm.controls.pourAmt5 == null) {
			this.setDrinks();
		} else {
			this.startMixing();
		}
	}

	setDrinks() {
		this.http.httpRequest(this.inputForm, 'mixerControl', 'SetDrinkOptions')
      .subscribe(
				response => {	},
        err => { },
        () => {}
      )
	}

	startMixing() {
		this.http.httpRequest(this.inputForm, 'mixerControl', 'InitMixing')
      .subscribe(
				response => {	},
        err => {	},
        () => {}
      )
	}

	onSubmit() {
    this.submitted = true;
  
    if (this.inputForm.invalid) {
      return;
    }

    this.loading = true;
    this.setDrinkOptions();
    this.loading = false;

  }
}
