const {ApolloServer, gql} = require('apollo-server-koa');
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
    deleteFile(fileID: ID!): File!
    """register(username: String!, password: String!): Token!"""
    singleUpload(file: Upload!): UploadFile!
  }

  type UploadFile {
    filename: String!
    mimetype: String!
    encoding: String!
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
    allowed: Boolean!
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