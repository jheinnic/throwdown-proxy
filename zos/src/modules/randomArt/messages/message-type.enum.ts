export enum MessageType {
   RENDER_AND_STORE_REQUEST = "RenderAndStoreRequest",
   RENDER_AND_STORE_REPLY = "RenderAndStoreReply",
   CANVAS_RELEASED_EVENT = "CanvasReleasedEvent",
   ASSIGN_CANVAS_REQUEST = "AssignCanvasRequest",
   CANVAS_ASSIGNED_REPLY = "CanvasAssignedReply",
   CANVAS_ASSIGNED_EVENT = "CanvasAssignedEvent",
   SHUTDOWN_REQUEST = "ShutdownRequest",
   SHUTTING_DOWN_REPLY = "ShuttingDownReply",
   PAINT_CANVAS_REQUEST = "PaintCanvasRequest",
   CANVAS_PAINTED_REPLY = "CanvasPaintedReply",
   STORE_ARTWORK_REQUEST = "StoreArtworkRequest",
   ARTWORK_STORED_REPLY = "ArtworkStoredReply"
}