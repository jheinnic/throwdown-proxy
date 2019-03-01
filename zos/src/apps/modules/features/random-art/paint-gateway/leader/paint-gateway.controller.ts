import {Controller} from '@nestjs/common';
import {GrpcMethod} from '@nestjs/microservices';
import {Observable} from 'rxjs';

@Controller()
export class PaintQueueController {
   @GrpcMethod("PaintQueue", "createPaintTask")
   createPaintTask (newTasks: Observable<CreatePaintTask>, meta: any ): Observable<ChannelHeartbeat> { }

   @GrpcMethod("PaintQueue", "updateTaskStatus")
   updateTaskState (taskUpdates: Observable<UpdateTaskState>, meta: any ): Observable<ChannelHeartbeat> { }
}