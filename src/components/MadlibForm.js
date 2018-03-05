var React = require('react');
// We're going to use this open source forms library to create our
// madlib form
var t = require('tcomb-form');
var { Form } = t.form;

var MadlibForm = React.createClass({
  // this is the function that renders the form. most of the HTML
  // is generated by the forms library, so you're pretty much stuck to
  // how they format it.
  getDefaultProps: function () {
    return {
      requireError: 'oops, you missed this one',
      endingWithLyError: 'this one has to end with "ly"'
    };
  },
  handleKeyPress: function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var formValues = this.state.value;

      if (Object.keys(formValues).length === 8) {
        $('#submitButton').click();
      } else {
        var $parentDiv = $(`#${e.target.id}`).parent();
        var $nextDiv = $parentDiv.next('.form-group');

        $parentDiv.removeClass('has-focus');
        $nextDiv.addClass('show');
        $nextDiv.addClass('has-focus');
        $nextDiv.children('input').focus();
      }
    }
  },
  render: function () {
    return (
      <div className='madlib-form'>
        <form onSubmit={this.onSubmit}>
          <Form
            ref="form"
            onChange={this.onChange}
            value={this.state.value}
            type={this.state.type}
            options={this.state.options}
          />
          {
            Object.keys(this.state.value).filter(key => this.state.value[key]).length === Object.keys(this.state.inputs).length
              ? (
                <button
                  className="submit-button"
                  type="submit"
                  id="submitButton"
                >
                  Make your madlib
                </button>
              )
              : null
          }
        </form>
      </div>
    );
  },
  // you probably shouldn't have to touch any of the other functions
  // on this class
  getInitialState: function () {
    var inputs = {};
    var result;

    t.String.getValidationErrorMessage = (value, path) => {
      if (!value) {
        return this.props.requireError;
      }
      if (path[0] === 'wordEndingWithLy' && !value.endsWith('ly')) {
        return this.props.endingWithLyError;
      }
    }

    var blankRegexp = /%&(.*?)&%/gi;
    while (result = blankRegexp.exec(this.props.text)) {
      var fieldType;
      if (result[1] === 'wordEndingWithLy') {
        fieldType = t.refinement(t.String, s => s.endsWith('ly'));
      } else if (result[1] === 'number') {
        fieldType = t.Number;
      } else {
        fieldType = t.String;
      }

      inputs[result[1]] = fieldType;
    }

    // append a keypress handler attr to all input fields
    var fieldNames = Object.keys(inputs);
    var fields = {};
    for (var i = 0; i < fieldNames.length; i++) {
      var field = fieldNames[i];
      if (field === 'number') {
        fields[field] = {
          type: 'number',
          attrs: { onKeyPress: this.handleKeyPress }
        }
      } else {
        fields[field] = {
          attrs: { onKeyPress: this.handleKeyPress }
        }
      }
    }

    return {
      type: t.struct(inputs),
      options: {
        fields: fields
      },
      value: {},
      submitted: false,
      inputs: inputs
    };
  },

  componentDidMount: function () {
    // focus intial form field
    $('#tfid-7-0').focus();
    $('.form-group-yourFavoriteRight').addClass('show');
    $('.form-group-yourFavoriteRight').addClass('has-focus');

    // enable focus on click
    $('.madlib-form input').focus(e => {
      $('.has-focus').removeClass('has-focus');
      $(e.target).parent().addClass('has-focus');
    });
  },
  // Handle display of error message and focusing
  componentDidUpdate: function () {
    var $errorDiv = $('.has-error');
    var isErrorShowing = $errorDiv.hasClass('show');
    var isErrorFocused = $errorDiv.hasClass('has-focus');
    var isErrorInputFocused = $errorDiv.children('input').is(':focus');
    var $currentFormGroup = $('input:focus').parent();

    if (!isErrorShowing) {
      $errorDiv.addClass('show');
    }
    if (isErrorInputFocused && !isErrorFocused) {
      $errorDiv.addClass('has-focus');
    }
    if (!$currentFormGroup.hasClass('show') || !$currentFormGroup.hasClass('has-focus')) {
      $currentFormGroup.addClass('show');
      $currentFormGroup.addClass('has-focus');
    }
  },
  onSubmit: function (event) {
    event.preventDefault();
    if (this.formsAreValid()) {
      this.props.onSubmit(this.getFormValues());
    }
  },
  onChange: function (value, path) {
    this.setState(
      { value: value }
    );
    this.refs.form.getComponent(path).validate();
  },
  formsAreValid: function () {
    return !this.refs.form.validate().errors.length;
  },
  getFormValues: function () {
    return this.refs.form.getValue();
  }
});

module.exports = MadlibForm;
