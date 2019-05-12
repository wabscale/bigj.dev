const {ApolloServer} = require('apollo-server-koa');
const {gql} = require('apollo-server');
const resolvers = require('./resolvers');

const typeDefs = gql`
  type Query {
    """Files"""
    file(fileID: ID!): File!
    files: [File]!
    fileHistory(fileID: ID!): [FileHistory]

    """OTP"""
    getOTP(fileID: ID!): OTP!

    """Users"""
    me: User!
    login(
      username: String!, 
      password: String!
    ): Token!
  }

  type Mutation {
    updateFile(
      fileID: ID!, 
      filename: String!,
      isPublic: Boolean!
    ): File!
    register(username: String!, password: String!): Token!
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
  
  type FileHistory {
    ipAddress: String!
    time: String!
  }

  type OTP {
    otp: String!
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ctx}) => ctx,
});

module.exports = {server, typeDefs};