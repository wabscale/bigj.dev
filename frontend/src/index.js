import ReactDOM from 'react-dom';
import React from 'react';
import ApolloClient from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import Paperbase from './Paperbase';
import * as serviceWorker from './serviceWorker';

const {createUploadLink} = require('apollo-upload-client');
const {InMemoryCache} = require('apollo-cache-inmemory');

const authFetch = (uri, options) => {
  const token = localStorage.getItem('token');
  if (!!token) {
    options.headers.token = localStorage.getItem('token');
  }
  return fetch(uri, options);
};

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
  },
  query: {
    fetchPolicy: 'no-cache',
  },
};

const client = new ApolloClient({
  link: createUploadLink({
    uri: 'https://f.bigj.dev/graphql',
    credentials: 'same-origin',
    fetch: authFetch,
  }),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

ReactDOM.render((
  <ApolloProvider client={client}>
    <Paperbase/>
  </ApolloProvider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
