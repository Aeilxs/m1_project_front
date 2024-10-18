import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup.component';
import { RouterModule, Routes } from '@angular/router';

const route = [{ path: '', component: SignupComponent }];

@NgModule({
  declarations: [SignupComponent],
  imports: [CommonModule, RouterModule.forChild(route)],
})
export class SignupModule {}
