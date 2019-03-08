import {
   sendUnaryData, Server as GrpcServer, ServerCredentials, ServerUnaryCall, ServerWriteableStream
} from 'grpc';
// import parseArgs from 'minimist';

import {
   IPaintGatewayServer, PaintGatewayService
} from '@jchgrpc/paint.gateway-node/lib/proto_grpc_pb';
import {
   AcknowledgePaintArtworkTask, CancelPaintArtworkTask, CreatePaintArtworkTask,
   MonitorPaintArtworkTask, RequestReceived
} from '@jchgrpc/paint.gateway-node/lib/proto_pb';
import { Injectable } from '@nestjs/common';

/**
 * Get a new server with the handler functions in this file bound to the methods
 * it serves.
 * @return {Server} The new server object
 */
@Injectable()
export class GeneGameGrpcServer
{
   private readonly server: GrpcServer;

   constructor()
   {
      this.server = new GrpcServer();
      this.server.addService<IPaintGatewayServer>(
         PaintGatewayService, this);
   }

   start()
   {
      this.server.bind('0.0.0.0:50051', ServerCredentials.createInsecure());

      // const argv = parseArgs(process.argv, {
      //    string: 'db_path'
      // });

      this.server.start();
   }

   public create(
      _call: ServerUnaryCall<CreatePaintArtworkTask>,
      _callback: sendUnaryData<RequestReceived>
   ): void
   {
      _call.request.getSeedprefix();
      _call.request.getSeedsuffix();
      _call.request.getNewmodel();
      _call.request.getRenderpolicy();
      _call.request.getStoragepolicy();
      _call.request.getAutoack();

      const retVal: RequestReceived = new RequestReceived();
      retVal.setId("idString");

      console.log(_call.request.toObject(true), '==>', retVal.toObject(true));

      _callback(null, retVal);
   }

   createAndMonitor(
      _call: ServerWriteableStream<CreatePaintArtworkTask>
   )
   {

   }

   monitor(
      _call: ServerWriteableStream<MonitorPaintArtworkTask>
   )
   {

   }

   cancel(
      _calla: ServerUnaryCall<CancelPaintArtworkTask>,
      _callback: sendUnaryData<RequestReceived>
   )
   {

   }

   acknowledge(
      _call: ServerUnaryCall<AcknowledgePaintArtworkTask>,
      _callback: sendUnaryData<RequestReceived>
   )
   {

   }
}

// if (require.main === module) {
//    If this is run as a script, start a server on an unused port
   // const paintGatewayServer = getServer();
   //
   // startGrpcServer(paintGatewayServer);
// }

