import {Director} from '../../lib';
import {interfaces} from 'inversify';
import BindingWhenOnSyntax = interfaces.BindingWhenOnSyntax;
import BindingWhenSyntax = interfaces.BindingWhenSyntax;

export interface CompositeBindingSyntaxBuilder<T> {
   bindHost(director: Director<BindingWhenOnSyntax<T>|BindingWhenSyntax<T>>): CompositeBindingSyntaxBuilder<T>;
   bindParent(director: Director<BindingWhenOnSyntax<any>|BindingWhenSyntax<any>>): CompositeBindingSyntaxBuilder<T>;
   bindAncestor(generationDistance: number, director: Director<BindingWhenOnSyntax<any>|BindingWhenSyntax<any>>): CompositeBindingSyntaxBuilder<T>;
}