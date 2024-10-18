import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, Inject, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, pairwise } from 'rxjs';
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

  constructor(
    @Inject(THEME) private theme: BehaviorSubject<'dark' | 'light'>,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    destroyRef: DestroyRef
  ) {
    this.theme.pipe(
      pairwise(),
      takeUntilDestroyed(destroyRef)
    ).subscribe(([previousTheme, currentTheme]) => {
      const rootElement = this.document.documentElement;
      this.renderer.removeClass(rootElement, previousTheme);
      this.renderer.addClass(rootElement, currentTheme);
    });
  }
}
