const {ApolloServer} = require('apollo-server-koa');
const {gql} = require('apollo-server');
const resolvers = require('./resolvers');

const typeDefs = gql`
  type Query {
    """Files"""
    file(fileID: ID!): File!
    files: [File]!

    """OTP"""
    otp(fileID: ID!): Otp!

    """Users"""
    me: User!
    login(
      username: String!, 
      password: String!
    ): Token!
  }
  
  type Token {
    token: String!
  }

  type User {
    username: String!
  }

  type File {
    fileID: ID!
    filename: String!
    isPublic: Boolean
    size: Int
  }

  type Otp {
    otp(fileID: String): String!
  }

  type Mutation {
    updateFile(updates: String): File!
    register(username: String!, password: String!): Token!
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ctx}) => ctx,
});

module.exports = {server, typeDefs};