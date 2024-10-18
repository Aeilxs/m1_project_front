import { Provider } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { THEME } from './theme.di-tokens';

function themeFactory(): BehaviorSubject<'dark' | 'light'> {
  let initialTheme: 'dark' | 'light' = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  // Check if there is a saved theme in local storage
  const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
  if (savedTheme) {
    initialTheme = savedTheme;
  }

  return new BehaviorSubject<'dark' | 'light'>(initialTheme);
}


export const THEME_PROVIDERS: Provider[] = [
  {
      provide: THEME,
      useFactory: themeFactory,
  },
];
