import {InjectionToken} from '@angular/core';
import * as js_csp from 'js-csp';

export const JS_CSP_MODULE = new InjectionToken<js_csp>('JS_CSP_MODULE', {
  providedIn: 'root',
  factory: () => js_csp
});

