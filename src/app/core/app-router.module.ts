import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@app/features/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'signin',
    loadChildren: async () => await import('@features/signin/signin.module').then((m) => m.SigninModule),
  },
  {
    path: 'signup',
    loadChildren: async () => await import('@features/signup/signup.module').then((m) => m.SignupModule),
  },
  {
    path: 'dashboard',
    loadChildren: async () => await import('@features/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRouterModule {}
