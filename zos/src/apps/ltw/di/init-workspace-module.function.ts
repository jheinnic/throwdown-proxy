import {WORKER_COMMAND_HANDLER_TYPES} from './types';
import {interfaces} from 'inversify';
import Bind = interfaces.Bind;

export function initWorkspaceModule(bind: Bind) {
   bind(WORKER_COMMAND_HANDLER_TYPES.InitWorkspace)
}