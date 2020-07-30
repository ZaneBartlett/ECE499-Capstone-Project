import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from '../services';
import { StatusInfo } from '../helpers';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css',
	      '../app.component.css']
})
export class DashboardComponent implements OnInit {

  timer;
	httpErrorCount = 0;

  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    private userStatus: StatusInfo,
    private mixerStatus: StatusInfo,
    private nfcStatus: StatusInfo
  ) { }

  ngOnInit() {
    this.statusInit();
    this.getDashboard();
    this.timer = setInterval(_ => {
      this.getDashboard();
    }, 250);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  statusInit() {
    this.userStatus = new StatusInfo();
    this.userStatus.code = 0;
    this.mixerStatus = new StatusInfo();
    this.mixerStatus.code = 0;
    this.nfcStatus = new StatusInfo();
    this.nfcStatus.code = 0;
  }

  /*
    Http Functions
  */

  getDashboard(): void {
    this.http.httpRequestNoForm('mixerControl', 'GetStatus')
      .subscribe(
				response => {
					this.httpErrorCount = 0;
          if(response != null) {
            this.mixerStatus.code = response.mixerStatus;
						this.userStatus.code = response.mixerStatus;
						this.nfcStatus.code = response.nfcStatus;
					}
				},
				err => {
	        console.error('Failed to get ntp sources. Error was ', err.message);
					this.httpErrorCount += 1;
					if(this.httpErrorCount > 100){
				    clearInterval(this.timer);
					}
				}
      )
  }


  /*
    HTML Functions
  */

  get user() { return this.userStatus.text; }
  get mixer() { return this.mixerStatus.text; }
	get nfc() { return this.nfcStatus.text; }

  statusColor(type: number) {
    switch(type) {
      case 1: { //for user status

				if (this.userStatus.code == 0) {
				  this.userStatus.color = {'background-color' : 'green'};
				  this.userStatus.text = "Good to go";
				} else if(this.userStatus.code == 1) {
				  this.userStatus.color = {'background-color' : 'yellow'};
				  this.userStatus.text = "Drink being made";
				} else if(this.userStatus.code == 2) {
				  this.userStatus.color = {'background-color' : 'red'};
				  this.userStatus.text = "Error occured while mixing";
				} else if(this.userStatus.code == 3) {
					this.userStatus.color = {'background-color' : 'yellow'};
          this.userStatus.text = "Waiting on user NFC tap";
				}

				return this.userStatus.color;
      }
      case 2: { //for mixing status

        if (this.mixerStatus.code == 0) {
          this.mixerStatus.color = {'background-color' : 'green'};
          this.mixerStatus.text = "Ready to order";
        } else if(this.mixerStatus.code == 1) {
          this.mixerStatus.color = {'background-color' : 'yellow'};
          this.mixerStatus.text = "Drink being made";
        } else if(this.mixerStatus.code == 2) {
          this.mixerStatus.color = {'background-color' : 'red'};
          this.mixerStatus.text = "Error occured while mixing";
        }

        return this.mixerStatus.color;
      }
      case 3: { //for nfc status

        if (this.nfcStatus.code == 0) {
          this.nfcStatus.color = {'background-color' : 'green'};
          this.nfcStatus.text = "No process occuring";
        } else if(this.nfcStatus.code == 1) {
          this.nfcStatus.color = {'background-color' : 'yellow'};
          this.nfcStatus.text = "Waiting for tap";
        } else if(this.nfcStatus.code == 2) {
          this.nfcStatus.color = {'background-color' : 'red'};
          this.nfcStatus.text = "NFC unavailable";
        }

        return this.nfcStatus.color;
      }

      default: {
				break;
      }
    }
  }  
}
