export enum MessageType {
   RELEASE_CANVAS_REQUEST = "ReleaseCanvasRequest",
   CANVAS_RELEASED_REPLY = "CanvasReleasedReply",
   ASSIGN_CANVAS_REQUEST = "AssignCanvasRequest",
   CANVAS_ASSIGNED_REPLY = "CanvasAssignedReply",
   SHUTDOWN_REQUEST = "ShutdownRequest",
   SHUTTING_DOWN_REPLY = "ShuttingDownReply",
   PAINT_CANVAS_REQUEST = "PaintCanvasRequest",
   CANVAS_PAINTED_REPLY = "CanvasPaintedReply",
   SAVE_IMAGE_REQUEST = "SaveImageRequest",
   IMAGE_SAVED_REPLY = "ImageSavedReply"
}