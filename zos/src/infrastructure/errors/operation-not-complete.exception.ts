class OperationNotCompletedException implements Error
{
   constructor(
      public message: string,
      public name: string)
   {

   }
}
