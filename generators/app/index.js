'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

var apiChoices = [{
  name: 'Alchemy Language',
  value: 'alchemy-language'
}, {
  name: 'Alchemy Vision',
  value: 'alchemy-vision'
}, {
  name: 'Alchemy Data News',
  value: 'alchemy-data-news'
}, {
  name: 'Authorization',
  value: 'authorization'
}, {
  name: 'Concept Expansion',
  value: 'concept-expansion'
}, {
  name: 'Concept Insights',
  value: 'concept-insights'
}, {
  name: 'Dialog',
  value: 'dialog'
}, {
  name: 'Document Conversion',
  value: 'document-conversion'
}, {
  name: 'Language Translation',
  value: 'language-translation'
}, {
  name: 'Natural Language Classifier',
  value: 'natural-language-classifier'
}, {
  name: 'Personality Insights',
  value: 'personality-insights'
}, {
  name: 'Question and Answer',
  value: 'question-and-answer'
}, {
  name: 'Relationship Extraction',
  value: 'relationship-extraction'
}, {
  name: 'Retrieve and Rank',
  value: 'retrieve-and-rank'
}, {
  name: 'Speech to Text',
  value: 'speech-to-text'
}, {
  name: 'Text to Speech',
  value: 'text-to-speech'
}, {
  name: 'Tone Analyzer',
  value: 'text-to-speech'
}, {
  name: 'Tradeoff Analytics',
  value: 'tradeoff-analytics'
}, {
  name: 'Visual Insights',
  value: 'visual-insights'
}, {
  name: 'Visual Recognition',
  value: 'visual-recognition'
}];

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.selectedAPIs = ['hello'];
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the flawless ' + chalk.red('generator-watson-developer-cloud-boilerplate') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: this.appname
    }, {
      type: 'checkbox',
      name: 'apis',
      message: 'Which Watson API do you want to use?',
      choices: apiChoices
    }];

    this.prompt(prompts, function (answers) {

      function hasAPI(api) {
        return answers.apis.indexOf(api) !== -1;
      }

      this.props = answers;

      // Set apis
      var apis = {};
      apiChoices.forEach(function(item) {
        apis[item.value] = hasAPI(item.value);
      });
      this.props.apis = apis;

      this.hasNoAPISelected = (answers.apis.length > 0);
      this.props.appName = answers.name;

      this.log(answers.name);
      this.log(answers.apis);

      done();
    }.bind(this));
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('demo-boilerplate-nodejs/**/*.*'),
      this.destinationPath('./')
    );

    this.fs.copy(
      this.templatePath('demo-boilerplate-nodejs/**/.*'),
      this.destinationPath('./')
    );

    this.fs.copyTpl(
      this.templatePath('demo-boilerplate-nodejs/app.js'),
      this.destinationPath('./app.js'), {
        apis: this.props.apis,
        noAPISelected: this.props.hasNoAPISelected
      }
    );

    this.fs.copyTpl(
      this.templatePath('demo-boilerplate-nodejs/package.json'),
      this.destinationPath('./package.json'), {
        appName: this.props.appName
      }
    );

    this.fs.delete('.git');
  },

  install: function () {
    this.installDependencies();
  }
});
