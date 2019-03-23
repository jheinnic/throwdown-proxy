import { Query } from '@nestjs/common';
import { Resolver, Mutation, Args, ResolveProperty, Parent } from '@nestjs/graphql';
import { EcosystemClient } from '../service/ecosystem-client.service';

interface Temp {
   id: number;
}

@Resolver('Ecosystem')
export class EcosystemResolver {
   constructor(
      private readonly postsService: EcosystemClient,
   ) {}

   @Query('author')
   async getAuthor(@Args('id') _id: number) {
      // return await this.authorsService.findOneById(id);
   }

   @Mutation()
   async upvotePost(@Args('postId') _postId: number) {
      // return await this.postsService.upvoteById({ id: postId });
   }

   @ResolveProperty('posts')
   async getPosts(@Parent() { id }: Temp) {
      return await this.postsService.findAll({ authorId: id });
   }
}