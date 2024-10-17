import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin.component';
import { RouterModule, Routes } from '@angular/router';

const route: Routes = [{ path: '', component: SigninComponent }];

@NgModule({
  declarations: [SigninComponent],
  imports: [CommonModule, RouterModule.forChild(route)],
  exports: [SigninComponent],
})
export class SigninModule {}
