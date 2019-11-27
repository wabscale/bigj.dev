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
      allowed
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
      rawOtp
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
      filename
      isPublic
    }
  }
`;

export const DELETE_FILE = gql`
  mutation DeleteFile($fileID: ID!) {
    deleteFile(fileID: $fileID) {
      fileID
      filename
    }
  }
`;


export const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!) {
    singleUpload(file: $file) {
      fileID
      filename
    }
  }
`;

export const GET_SETTINGS = gql`
  query GetSettings {
    getSettings {
      key
      value
    }
    
    me {
      username
    }
  }
`;

export const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($keys: [String]!, $values: [String]!) {
    updateSettings(keys: $keys, values: $values) {
      message
    }
  }
`;

export const UPDATE_OTP = gql`
  mutation UpdateOTP($otp: String!, $timeout: Int!) {
    updateOTP(otp: $otp, timeout: $timeout) {
      message
      description
    }
  }
`;

export const WHOAMI = gql`
  {
    me {
      username
    }
  }
`;

export const GET_CONFIG = gql`
  query GetConfig($key: String!){
    getSetting(key: $key) {
      key
      value
    }
  }
`;

// const UPDATE_FILE = gql``;