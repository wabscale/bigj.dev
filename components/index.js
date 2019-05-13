import ReactDOM from 'react-dom';
import React from 'react';
import ApolloClient from 'apollo-client';
const { createUploadLink } = require('apollo-upload-client');
const { InMemoryCache } = require('apollo-cache-inmemory');
import {ApolloProvider} from 'react-apollo';
import Paperbase from './Paperbase';

const authFetch = (uri, options) => {
  options.headers.token = localStorage.getItem('token');
  return fetch(uri, options)
}

const client = new ApolloClient({
  link: createUploadLink({
    uri: APIHOST,
    credentials: 'same-origin',
    fetch: authFetch,
  }),
  cache: new InMemoryCache(),
});

ReactDOM.render((
  <ApolloProvider client={client}>
    <Paperbase/>
  </ApolloProvider>
), document.getElementById('react-container'));