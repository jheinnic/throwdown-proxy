import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { GeneGameModule } from './gene-game.module';

@Module({
   imports: [
      GeneGameModule,
      GraphQLModule.forRoot({
         typePaths: ['./**/*.graphql'],
         debug: true,
         playground: true,
         installSubscriptionHandlers: true,
         definitions: {
            path: join(process.cwd(), 'src/graphql.schema.ts'),
            outputAs: 'class',
         },
      }),
   ],
})
export class ApplicationModule
{
   constructor()
   {
   }
}