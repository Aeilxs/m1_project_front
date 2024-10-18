import { Component, Inject } from '@angular/core';
import { THEME } from '@app/core/services/themes/theme.di-tokens';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  readonly theme$: Observable<'dark' | 'light'>;

  constructor(@Inject(THEME) private theme: BehaviorSubject<'dark' | 'light'>) {
    this.theme$ = this.theme.asObservable();
  }

  toggleTheme() {
    this.theme.next(this.theme.value === 'dark' ? 'light' : 'dark');
  }
}
