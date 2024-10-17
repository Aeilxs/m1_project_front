import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeManagerService {
  theme = signal<Theme>('light');

  private _document = inject(DOCUMENT);

  constructor() {
    // Handle client OS favorite theme color
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) this.theme.set('dark');

    // Handle local storage previous theme definition
    const savedTheme = localStorage.getItem('theme') as Theme;
    savedTheme ? this.theme.set(savedTheme) : this.theme.set('light');

    effect(() => {
      const currentTheme = this.theme();
      currentTheme === 'dark'
        ? this._document.documentElement.classList.add('dark')
        : this._document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', currentTheme);
    });
  }

  toggleTheme() {
    this.theme.update((value) => {
      return value === 'light' ? 'dark' : 'light';
    });
  }
}
