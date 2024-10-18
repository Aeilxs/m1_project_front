import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const THEME = new InjectionToken<
    (theme: 'dark' | 'light') => BehaviorSubject<string>
>('[THEME] current Theme');
