const express = require('express');
const bodyParser = require('body-parser');
const neo4j = require('neo4j-driver').v1;
const neo4jGraphqlJs = require('neo4j-graphql-js');

const {gql} = require('graphql-tag');
const {makeExecutableSchema} = require('graphql-tools');
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');

let driver;

function context(headers, secrets)
{
   if (!driver) {
      driver = neo4j.driver(
        'bolt://localhost:7687',
        neo4j.auth.basic('neo4j', 'letmein')
      );
   }
   return {driver};
}

const typeDefs = gql`
    type Query {
        hello: String
    }

    schema {
        query: Query
    }`;

const resolvers = {
   Query: {
      hello(root)
      {
         return 'world';
      }
   }
};

const schema = makeExecutableSchema({
   typeDefs,
   resolvers
});
const app = express();
app.use('/graphql', bodyParser.json(), graphqlExpress((request) => {
   return {
      schema,
      rootValue,
      context: context(request.headers, process.env)
   };
}));
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));
app.listen(6000, () => console.log('Now browse to localhost:6000/graphiql'));
