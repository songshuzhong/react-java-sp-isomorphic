import React, { Component } from 'react';

import logo from '../../media/logo.svg';

/**
 * App
 */
class App extends Component {

  /**
   * constructor
   */
  constructor( props ) {
    super( props );
    this.state = { dataSource: {} };
  }

  /**
   * render
   */
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={ `${ logo }` } className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export { App };
export default App;
