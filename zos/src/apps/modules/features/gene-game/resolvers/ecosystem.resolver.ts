import { Query } from '@nestjs/common';
import { Resolver, Mutation, Args, ResolveProperty, Parent } from '@nestjs/graphql';
import { EcosystemClient } from '../service/ecosystem-client.service';

@Resolver('Ecosystem')
export class EcosystemResolver {
   constructor(
      private readonly postsService: EcosystemClient,
   ) {}

   @Query('author')
   async getAuthor(@Args('id') id: number) {
      // return await this.authorsService.findOneById(id);
   }

   @Mutation()
   async upvotePost(@Args('postId') postId: number) {
      // return await this.postsService.upvoteById({ id: postId });
   }

   @ResolveProperty('posts')
   async getPosts(@Parent() { id }) {
      return await this.postsService.findAll({ authorId: id });
   }
}