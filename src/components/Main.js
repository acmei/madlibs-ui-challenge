// attempt to reset browser differences in default CSS
require('normalize.css/normalize.css');
// this file is where styles should go
require('styles/App.scss');

// Flocabulary uses React extensively. This exercise is built with it
// but it is not required knowledge. Ideally, you will not have to
// alter any javascript. React comes with an HTML-like syntax
// called jsx, which you can alter much like HTML.
var React = require('react');

var MadlibForm = require('./MadlibForm');
var SubmittedMadlib = require('./SubmittedMadlib');

// These are lyrics to a Flocabulary song that has had some
// terms replaced for the purposes of the madlib.
var MADLIB_TEXT = require('../madlibs/bill-of-rights');

// This is the main component of the interface
var AppComponent = React.createClass({
  render: function () {
    var content = (
      this.state.submittedValue
        ? (
          // check out SubmittedMadlib.js to see the markup for this element
          <SubmittedMadlib
            reset={this.reset}
            text={this.props.text}
            value={this.state.submittedValue}
          />
        )
        : (
          // check out MadlibForm.js to see the markup for this element
          <MadlibForm
            text={this.props.text}
            onSubmit={
              value => this.setState({ submittedValue: value })
            }
          />
        )
    );


    return (
      <div className="main">
        <div className="madlib-intro">
          <h1 className="title">Flocabulary Madlib</h1>
          <p className="subtitle">Fill out the form below to create your madlib</p>
        </div>
        {content}
      </div>
    );
  },

  getInitialState: function () {
    return {
      submittedValue: null
    };
  },
  getDefaultProps: function () {
    return {
      text: MADLIB_TEXT
    };
  },
  reset: function () {
    this.setState(this.getInitialState());
  }
});

module.exports = AppComponent;
