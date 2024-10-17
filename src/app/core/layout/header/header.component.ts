import { Component, inject } from '@angular/core';
import { ThemeManagerService } from '@core/services/theme-manager.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private themeManager = inject(ThemeManagerService);
  theme = this.themeManager.theme;

  toggleTheme() {
    this.themeManager.toggleTheme();
  }
}
