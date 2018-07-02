import {Observable, Subject} from 'rxjs';

export namespace MessagingModels {
  export class ChannelAddress<P> {
    constructor(public readonly name: string) { }

    getType(): typeof P {
      return null;
    }
  }

  export interface RoutingSlip<P>
  {
    itinerary: ChannelAddress<P>[];
    stopsMade: ChannelAddress<P>[];
    replyTo: ChannelAddress<P>;
    sendTo: ChannelAddress<P>;
  }

  export interface Message<P> {
    routingSlip: RoutingSlip<P>;
    payload: P;
  }

  export interface ChannelEntry<P> {
    sink: Subject<Message<P>>;
    source: Observable<Message<P>>;
  }

  export interface ChannelRegistryState {
    channelsByAddress: Map<ChannelAddress<any>, ChannelEntry<any>>;
  }
}
