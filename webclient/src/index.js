import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import ResizeContextProvider from './contexts/resizeContext';
import { BrowserRouter as Router } from 'react-router-dom';

const client = new ApolloClient({
  uri: 'http://localhost:8091/v1/graphql',
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ResizeContextProvider>
        <Router>
          <App />
        </Router>
      </ResizeContextProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
