import {SymbolEnum} from '../../../infrastructure/lib/index';

type WorkerTypes = 'InitWorkspace';

export const WORKER_COMMAND_HANDLER_TYPES: SymbolEnum<WorkerTypes> = {
   InitWorkspace: Symbol.for('InitWorkspaceHandler')
};

export const WORKER_COMMAND_INPUT_TYPES: SymbolEnum<WorkerTypes> = {
   InitWorkspace: Symbol.for('InitWorkspaceInput')
};