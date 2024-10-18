import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { THEME } from '@app/core/services/themes/theme.di-tokens';
import { NAV_MENU_OPTS, MenuOpt } from '@constants/';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly theme$: Observable<'dark' | 'light'>;
  readonly navMenuOpts = NAV_MENU_OPTS;

  constructor(@Inject(THEME) private theme: BehaviorSubject<'dark' | 'light'>) {
    this.theme$ = this.theme.asObservable();
  }

  toggleTheme() {
    this.theme.next(this.theme.value === 'dark' ? 'light' : 'dark');
  }
}
