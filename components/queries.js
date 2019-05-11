import gql from 'graphql-tag';

export const GET_FILES = gql`
  {
    files {
      fileID
      filename
      isPublic
      size
    }
  }
`;

export const GET_FILE = gql`
  query GetFile($fileID: ID!) {
    file(fileID: $fileID) {
      fileID
      filename
      isPublic
      size
    }
  }
`;

export const LOGIN = gql`
  query Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

// const UPDATE_FILE = gql``;