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

export const GET_DOWNLOAD_HISTORY = gql`
  query GetDownloadHistory($fileID: ID!) {
    fileHistory(fileID: $fileID) {
      ipAddress
      time
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

export const GET_OTP = gql`
  query GetOtp($fileID: ID!) {
    getOTP(fileID: $fileID) {
      otp
    }
  }
`;

export const GET_FILE_SIZE = gql`
  query GetFileSize($fileID: ID!) {
    file(fileID: $fileID) {
      size
    }
  }
`;

export const UPDATE_FILE = gql`
  mutation UpdateFile($fileID: ID!, $filename: String!, $isPublic: Boolean!) {
    updateFile(fileID: $fileID, filename: $filename, isPublic: $isPublic) {
      filename, 
      isPublic
    }
  }
`;

// const UPDATE_FILE = gql``;