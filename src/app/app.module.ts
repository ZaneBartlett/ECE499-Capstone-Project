import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ConfigComponent, PasswordDialog } from './config/config.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InputComponent } from './input/input.component';

import { User } from './helpers';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ConfigComponent,
    DashboardComponent,
    InputComponent,
  ],
  imports: [
		BrowserAnimationsModule,
    BrowserModule,
		FormsModule,
		HttpClientModule,
		MatCheckboxModule,
		MatTabsModule,
		ReactiveFormsModule,
		MatDialogModule,
  ],
  providers: [User],
  bootstrap: [AppComponent],
	entryComponents: [PasswordDialog]
})
export class AppModule { }
