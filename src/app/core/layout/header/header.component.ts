import { Component, inject } from '@angular/core';
import { ThemeManagerService } from '@core/services/theme-manager.service';
import { NAV_MENU_OPTS } from '@constants/index.ts';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private themeManager = inject(ThemeManagerService);
  theme = this.themeManager.theme;

  navMenuOpts() {
    return NAV_MENU_OPTS;
  }

  toggleTheme() {
    this.themeManager.toggleTheme();
  }
}
