import {Directive} from '@angular/core';
import {CspFactoryService} from './csp-factory.service';

@Directive({
  selector: '[ngxMsgNamespace]',
  exportAs: 'csp-namespace,csp-container,cspNamespace,cspContainer',
  providers: [CspFactoryService]
})
export class CspNamespaceDirective {

}
