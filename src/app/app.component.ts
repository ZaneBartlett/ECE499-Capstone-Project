import { Component, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { HttpService } from './services';

/**
* this is the backend handler for the main page of the site
* other components are located in their own directory
*/

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

	userForm: FormGroup;
  title = 'Dashboard';
  loggedIn = false;

  constructor (
    private http: HttpService,
		private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.http.currentState.subscribe(loggedIn => {this.loggedIn = loggedIn;} )
  }

  /**
  * this function is called from app.component.html when a tab is selected
  * if we want a certain event to occur under a tab, we can check the 
  * tabChangeEvent.index to determine what tab we are on
  */

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
      if(tabChangeEvent.index == 5) {
				this.userForm = this.formBuilder.group({
					username: [this.http.currentUserValue.username],
					password: [this.http.currentUserValue.password]
				});
        this.loggedIn = false;
        this.http.logout(this.userForm);
				window.location.reload();
      }      
  }
}
