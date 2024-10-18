import { Component, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { THEME } from './core/services/themes/theme.di-tokens';
import { THEME_PROVIDERS } from './core/services/themes/theme.providers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [THEME_PROVIDERS],

})
export class AppComponent {
  title = 'partocheV2';
  readonly theme$: Observable<'dark' | 'light'>;

  constructor(
    @Inject(THEME) private theme: BehaviorSubject<'dark' | 'light'>,
  ) {
    this.theme$ = this.theme.asObservable();
  }
}
