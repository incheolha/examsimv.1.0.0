import { AuthenticationComponent } from './authentication.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';
import { PurchasedHistoryComponent } from './profile/purchased-history/purchased-history.component';

export const authRoutes: Routes = [
{ path: 'auth', component: AuthenticationComponent, children: [
          { path: 'signup', component: SignupComponent },
          { path: 'login', component: LoginComponent },
          { path: 'profile', component: ProfileEditComponent },
          { path: 'orderHistory', component: PurchasedHistoryComponent },
          { path: 'logout', component: LogoutComponent }
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}


