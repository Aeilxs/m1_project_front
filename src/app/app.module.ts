// Boilerplate
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

// App config (si standalone)
import { provideRouter } from '@angular/router';
import { provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Core
import { AppRouterModule, routes } from '@core/app-router.module';
import { LayoutModule } from '@core/layout/layout.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRouterModule, LayoutModule],
  bootstrap: [AppComponent],
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync()],
})
export class AppModule {}
