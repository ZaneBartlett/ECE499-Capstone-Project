import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '../services';

export interface DialogData {
  password: string;
}

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css',
	      '../app.component.css']
})
export class ConfigComponent implements OnInit {

	fileToUpload = null;
  password: string;
  isAdmin = false;
  submitted = false;
	networkForm: FormGroup;
	paymentForm: FormGroup;
	dhcpCheck = true;

  constructor(
    public dialog: MatDialog,
		private formBuilder: FormBuilder,
    private httpService: HttpService
  ) {	}


  ngOnInit() { 
		this.networkForm = this.formBuilder.group({
			enableDhcp: [false],
			nfcMode: [false],
      ipAddress: this.formBuilder.group({
				ipAddress1: [10, Validators.required],
				ipAddress2: [0, Validators.required],
				ipAddress3: [0, Validators.required],
				ipAddress4: [0, Validators.required]
      }),
      ipMask: this.formBuilder.group({
				ipMask1: [255, Validators.required],
				ipMask2: [255, Validators.required],
				ipMask3: [255, Validators.required],
				ipMask4: [0, Validators.required]
      }),
      gateway: this.formBuilder.group({
				gateway1: [10, Validators.required],
				gateway2: [0, Validators.required],
				gateway3: [0, Validators.required],
				gateway4: [0, Validators.required]
      })
		});

		this.paymentForm = this.formBuilder.group({
			username: [this.httpService.currentUserValue.username],
			ccNumber: [0, Validators.required],
			ccExpiryMonth: [0, Validators.required],
			ccExpiryYear: [0, Validators.required],
			cvv: [0, Validators.required],
			cardName: ["", Validators.required]
		})

		this.isAdmin = this.httpService.currentUserValue.isAdmin;
		this.getNetwork();
		this.getPayment();
  }

	getNetwork(): void {
		this.httpService.httpRequest(this.networkForm, 'factory', 'GetNetwork')
			.subscribe(
				response => {
					this.networkForm.patchValue({ 
						enableDhcp: response.enableDhcp,
						ipAddress: {
							ipAddress1: response.ipAddress1,
							ipAddress2: response.ipAddress2,
							ipAddress3: response.ipAddress3,
							ipAddress4: response.ipAddress4
						},
						ipMask: {
							ipMask1: response.ipMask1,
							ipMask2: response.ipMask2,
							ipMask3: response.ipMask3,
							ipMask4: response.ipMask4
						},
						gateway: {
							gateway1: response.gateway1,
							gateway2: response.gateway2,
							gateway3: response.gateway3,
							gateway4: response.gateway4
						}
					});
				},
				err => { console.error(err); },
				() => {}
			);
	}

	setNetwork(): void {
		this.httpService.httpRequest(this.networkForm, 'factory', 'SetNetwork')
			.subscribe(
				response => {
					this.networkForm.patchValue({ 
						enableDhcp: response.enableDhcp,
						ipAddress: {
							ipAddress1: response.ipAddress1,
							ipAddress2: response.ipAddress2,
							ipAddress3: response.ipAddress3,
							ipAddress4: response.ipAddress4
						},
						ipMask: {
							ipMask1: response.ipMask1,
							ipMask2: response.ipMask2,
							ipMask3: response.ipMask3,
							ipMask4: response.ipMask4
						},
						gateway: {
							gateway1: response.gateway1,
							gateway2: response.gateway2,
							gateway3: response.gateway3,
							gateway4: response.gateway4
						}
					});
					console.log(this.networkForm.controls.enableDhcp.value);
				},
				err => { console.error(err); },
				() => {}
			);
	}

	getPayment() {
		this.httpService.httpRequest(this.paymentForm, 'userAuth', 'GetPaymentInfo')
      .subscribe(
        response => {
          this.paymentForm.patchValue({
						ccNumber: response.ccNumber,
						ccExpiryMonth: response.ccExpiryMonth,
						ccExpiryYear: response.ccExpiryYear,
						cvv: response.cvv,
						cardName: response.cardName
          });
        },
        err => { console.error(err); },
        () => {}
      );
	}

	setPayment() {
		this.httpService.httpRequest(this.paymentForm, 'userAuth', 'SetPaymentInfo')
      .subscribe(
        response => {
          this.paymentForm.patchValue({
						ccNumber: response.ccNumber,
						ccExpiryMonth: response.ccExpiryMonth,
						ccExpiryYear: response.ccExpiryYear,
						cvv: response.cvv,
						cardName: response.cardName
          });
        },
        err => { console.error(err); },
        () => {}
      );
	}

  reboot() {
    this.httpService.httpRequestNoForm('device', 'PowerCycle')
        .subscribe(
          response => {},
          err => {
            console.error('Failed to get options. Error was ', err.message);
          }
        );
  }

  powerOff() {
    this.httpService.httpRequestNoForm('device', 'PowerOff')
      .subscribe(
        response => {},
        err => {
          console.error('Failed to get options. Error was ', err.message);
        }
      );
  }


  uploadPhotoId() {
    this.httpService.postFile(this.fileToUpload).subscribe(
      data => { 
				console.log("File upload success");
			},
      error => { 
				window.location.reload()
				console.log(error);
			},
			() => {}
    );
  }

	/*
	*	HTML Functions
	*/

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

	networkSubmit() {
		this.submitted = true;

		if (this.networkForm.invalid) {
			return;
		}

		this.setNetwork();

		this.submitted = false;
	}

	paymentSubmit() {
		this.submitted = true;

		if (this.paymentForm.invalid) {
			return;
		}

		this.setPayment();

		this.submitted = false;
	}

  changePassword(): void {
    const dialogRef = this.dialog.open(PasswordDialog, {
      width: '300px',
      data: {password: this.password}
    });

    dialogRef.afterClosed().subscribe(
      result => { 
				this.password = result;
    });
  }
}



@Component({
  selector: 'password-dialog',
  templateUrl: './password-dialog.html',
})
export class PasswordDialog {

  passwordForm: FormGroup;
  loading = false;
  submitted = false;
  correctPassword = true;
  passwordsMatch = true;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    public dialogRef: MatDialogRef<PasswordDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
			username: [this.httpService.currentUserValue.username],
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      newPasswordRepeated: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get form() { return this.passwordForm.controls; }

  onSubmit() {
    this.submitted = true;

    this.correctPassword = true;
    this.passwordsMatch = true;

    if (this.passwordForm.invalid) {
      return;
    }

    if (this.passwordForm.controls.currentPassword.value !== this.httpService.currentUserValue.password){
      this.correctPassword = false;
    }
    
    if (this.passwordForm.controls.newPassword.value !== this.passwordForm.controls.newPasswordRepeated.value){
      this.passwordsMatch = false;
    }

    if (!this.correctPassword || !this.passwordsMatch){
      return;
    }

    this.httpService.httpRequest(this.passwordForm, 'userAuth', 'UpdatePassword')
      .subscribe(
				user => { 
					if(user != null) {
						this.passwordForm = user 
					} else {
						this.correctPassword = false;
						return;
					}
				},
				err => { console.error('Failed to set password')},
				() => { console.log("password updated") }
			);

    this.dialogRef.close();
  }
}
