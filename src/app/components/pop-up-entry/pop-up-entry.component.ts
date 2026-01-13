import {Component, AfterViewInit, OnDestroy, OnInit, ViewChild, ElementRef} from '@angular/core';
import { PopUpEntryService } from './pop-up-entry.service';
import { TokenService } from '../token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from '../admin/admin.service';
import {environment} from '../../../environment'
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
@Component({
  selector: 'app-pop-up-entry',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './pop-up-entry.component.html',
  styleUrls: ['./pop-up-entry.component.css']
})
export class PopUpEntryComponent implements AfterViewInit, OnDestroy, OnInit {

  authForm: FormGroup;
  isError: boolean = false;

  constructor(
    public popUpEntryService: PopUpEntryService,
    private tokenService: TokenService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  setVisibleError() {
    this.isError = true;
    setTimeout(() => {
      this.isError = false;
    }, 1000);
  }



  getLoginForm() {
    this.popUpEntryService.confirmAuth = false;
    this.popUpEntryService.accessVerification = true;
    this.popUpEntryService.isAuth == false;
  }

  authUser() {

    const formData = this.authForm.value;
    console.log('formData', formData);
    formData.email = formData.email.trim();
    const data = { ...formData };
    if (this.popUpEntryService.isAuth === true) {
      delete data.telegram;
    }

    // if (this.popUpEntryService.isAuth === true) {
    //   this.popUpEntryService.authUesr(data).subscribe((response: any) => {
    //     console.log('Auth response from backend:', response);
    //     this.tokenService.setToken(response.token);
    //     localStorage.setItem('userNickname', response.nickname);
    //     this.userAuthenticated = true;
    //     this.login_user();
    //   })
    // } else {
    this.popUpEntryService.signUpUesr(data).subscribe((response: any) => {
      this.popUpEntryService.confirmAuth = true;

      localStorage.setItem('confirmAuth', 'true');
      localStorage.setItem('authEmail', formData.email);
      // console.log('Auth response from backend:', response);
      // this.tokenService.setToken(response.token);
      // this.userAuthenticated = true;
      // this.login_user();
    }, (error) => {
      this.errorMessage = error.error.details;
    })
    // }
  }


  private domain = `${environment.apiUrl}`;
  telegramWidgetLoaded: boolean = false;
  userAuthenticated: boolean = false;
  errorMessage: string = '';

  ngAfterViewInit() {

  }

  ngOnInit() {
    const confirmAuth = localStorage.getItem('confirmAuth');
    const savedEmail = localStorage.getItem('authEmail');

    if (confirmAuth === 'true') {
      this.popUpEntryService.confirmAuth = true;
      this.popUpEntryService.accessVerification = false;
    }

    if (savedEmail) {
      this.authForm.patchValue({ email: savedEmail });
    }
  }

  ngOnDestroy() {
    this.telegramWidgetLoaded = false;
  }

  login_user() {
    this.popUpEntryService.visible = false;
    const token = this.tokenService.getToken();
    this.popUpEntryService.getUser().subscribe(
      (data) => {
        const firstNameValid = typeof data.firstName === 'string' && data.firstName.trim() !== '';
        const lastNameValid = typeof data.lastName === 'string' && data.lastName.trim() !== '';
        const genderValid = typeof data.gender === 'string' && data.gender.trim() !== '';
        const ageValid = typeof data.age === 'number' && data.age > 0;
        const cityOfResidenceValid = typeof data.cityOfResidence !== null;
        const emailValid = typeof data.email === 'string' && data.email.trim() !== '';

        const isDataValid = firstNameValid && lastNameValid && genderValid && ageValid && cityOfResidenceValid && emailValid;

        // true -> b326b5062b2f0e69046810717534cb09

        if (!isDataValid) {
          localStorage.setItem('fullAccess', 'we26b502b2fe32e69046810717534b32d');
        } else {
          localStorage.setItem('fullAccess', 'b326b5062b2f0e69046810717534cb09');
        }
        console.log('----------data ', data)
        localStorage.setItem('Linkken', data.imageLink);
        localStorage.setItem('userNickname', data.nickname);
        sessionStorage.setItem('userData', JSON.stringify(data));
        this.popUpEntryService.userVisible = true;
        this.popUpEntryService.visible = false;
        this.router.navigate([`/admin/${data.nickname}`]);
        this.closePopUp();
      },
      (error) => {
      }
    );
    this.closePopUp()
  }



  closePopUp() {
    this.popUpEntryService.visible = false;
    this.telegramWidgetLoaded = false;
    this.errorMessage = '';
    localStorage.removeItem('confirmAuth');
    localStorage.removeItem('authEmail');
  }

  clearCookies() {
    const cookies = document.cookie.split(';');

    // Loop through the cookies and delete each one
    for (let cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      // Setting the cookie expiration date to the past will delete it
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  }


  @ViewChild('digit1') digit1!: ElementRef;
  @ViewChild('digit2') digit2!: ElementRef;
  @ViewChild('digit3') digit3!: ElementRef;
  @ViewChild('digit4') digit4!: ElementRef;
  @ViewChild('digit5') digit5!: ElementRef;
  @ViewChild('digit6') digit6!: ElementRef;

  moveFocus(event: any, nextField: number, type?: string) {
    event.target.value.length > 1 ? event.target.value = event.data.slice(0, 1) : event.target.value;

    if (type && type === 'delete') {
      switch (nextField) {
        case 0: this.digit2.nativeElement.value = ''; break;
        case 1: this.digit3.nativeElement.value = ''; break;
        case 2: this.digit4.nativeElement.value = ''; break;
        case 3: this.digit5.nativeElement.value = ''; break;
        case 4: this.digit6.nativeElement.value = ''; break;
      }
    }

    if (event.target.value.length >= 1 || type === 'delete') {
      switch (nextField) {
        case 0: this.digit1.nativeElement.focus(); break;
        case 1: this.digit2.nativeElement.focus(); break;
        case 2: this.digit3.nativeElement.focus(); break;
        case 3: this.digit4.nativeElement.focus(); break;
        case 4: this.digit5.nativeElement.focus(); break;
        case 5: this.digit6.nativeElement.focus(); break;
        case 6: this.verifyCode(); break;
      }
    }

  }

  verifyCode() {
    const code = this.digit1.nativeElement.value +
      this.digit2.nativeElement.value +
      this.digit3.nativeElement.value +
      this.digit4.nativeElement.value +
      this.digit5.nativeElement.value +
      this.digit6.nativeElement.value

    const savedEmail = localStorage.getItem('authEmail');
    const formData = this.authForm.value;
    formData.password = code;
    delete formData.telegram;
    formData.email = savedEmail;
    const data = { ...formData };
    this.popUpEntryService.authUesr(data).subscribe((response: any) => {
      this.tokenService.setToken(response.token);
      localStorage.setItem('userNickname', response.nickname);
      this.userAuthenticated = true;
      this.popUpEntryService.visible = false;
      localStorage.removeItem('confirmAuth');
      localStorage.removeItem('authEmail');
      this.login_user();
    })

  }



}
