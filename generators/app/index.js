'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
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
    }];

    this.prompt(prompts, function (answers) {
      this.props = answers;
      this.log(answers.name);
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

    this.fs.delete('.git');
  },

  install: function () {
    this.installDependencies();
  }
});
