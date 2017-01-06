import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule}   from '@angular/forms';
import {HttpModule}    from '@angular/http';

import {AppComponent}  from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {Angular2JWTModule} from 'angular2-jsonwebtoken';
import {LoginComponent} from './login/login.component';
import {UserService} from "./remote/user.service";
import {AuthenticationService} from './remote/authentication.service';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {UsersComponent} from "./users/users.component";
import {AuthGuard} from "./auth/auth-guard.service";

// used to create fake backend
import {BaseRequestOptions} from '@angular/http';

import {RequestOptions, Http} from "@angular/http";
import {AuthHttp, AuthConfig} from 'angular2-jwt';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Content-Type':'application/json'}]
  }), http, options);
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    Angular2JWTModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UsersComponent,
    LoginComponent
  ],
  providers: [
    UserService,
    AuthGuard,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    AuthenticationService,
    // providers used to create fake backend_helpers/index
    BaseRequestOptions
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}

