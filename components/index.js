import ReactDOM from 'react-dom';
import React from 'react';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import Paperbase from './Paperbase';

const client = new ApolloClient({
  uri: 'http://api.localhost:8080/graphql',
  credentials: 'same-origin',
  request: async operation => {
    const token = await localStorage.getItem('token');
    operation.setContext({
      headers: {
        token,
      }
    });
  },
});

ReactDOM.render((
  <ApolloProvider client={client}>
    <Paperbase/>
  </ApolloProvider>
), document.getElementById('react-container'));