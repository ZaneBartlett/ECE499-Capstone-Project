import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from '../helpers';
@Injectable({ providedIn: 'root' })

export class HttpService {
  url = '/command';
  private currentUser: BehaviorSubject<any>;
  public currentState: Observable<any>;
  
  constructor(private http: HttpClient, private user: User) {
    this.currentUser = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user')));
    this.currentState = this.currentUser.asObservable();
  }

  ngOnInit() {
    this.user = { 
			username: '', 
			password: '', 
			admin: false,
			loggedIn: false 
		};
  }

  httpRequest(form: FormGroup, target: string, action: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Target', target);
    headers = headers.append('Action', action);
    return this.http.post(this.url, form.value, {headers})
      .pipe(catchError(this.handleError));
  }

  httpRequestNoForm(target: string, action: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Target', target);
    headers = headers.append('Action', action);
    return this.http.post(this.url, {}, {headers})
      .pipe(catchError(this.handleError));
  }

  httpVersionRequest(target: string, action: string): Observable<any> {
    const uploadUrl = '/versions';
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Target', target);
    headers = headers.append('Action', action);
    return this.http.post(uploadUrl, {}, {headers})
      .pipe(catchError(this.handleError));
  }

  postFile(fileToUpload: File): Observable<any> {
    const uploadUrl = '/update';
    let formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.http.post(uploadUrl, formData)
			.pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.log("Uh oh! handleError() initiated...")
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message)
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`)
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.')
  }

  public get currentUserValue() {
    return this.currentUser.value;
  }

  login(form: FormGroup) {
		this.httpRequest(form, "userAuth", "Login")
			.subscribe(
				result => {
					if(result != null){
						this.user = result
				    localStorage.setItem('user', JSON.stringify(this.user));
				    this.currentUser.next(this.user);
					}
				},
				err => {
					console.log("Failed to log in: ", err)
				},
				() => {
					console.log("Login complete")
				}
			);
		console.log(this.user)
		if ( this.user.username != '' ) { 
		  return this.user.loggedIn;
		} else {
			return false;
		}
  }

  logout(form: FormGroup) {
    localStorage.removeItem('user');
		this.currentUser.next(null);
		this.httpRequest(form, "userAuth", "Logout")
			.subscribe(
				result => {	},
				err => {
					console.log(err)
				},
				() => {
					console.log("Logout complete")
				}
			);
    return false;
  }
}
