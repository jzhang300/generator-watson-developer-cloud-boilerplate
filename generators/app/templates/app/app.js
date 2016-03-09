/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express');
var app = express();
var vcapServices = require('vcap_services');
var extend = require('util')._extend;
var watson = require('watson-developer-cloud');
<% if (apis['text-to-speech']) { %>var fs = require('fs');<% } %>

/**
 * This sets up configurations for Express, a NodeJS web framework.
 * To learn more about Express, see http://expressjs.com/
 */
require('./config/express')(app);

/**
 * To learn how to use the Watson API's with the watson-developer-cloud node package,
 * see https://www.npmjs.com/package/watson-developer-cloud.
 *
 * In order to use the Watson API's, you need to obtain credentials for each API.
 * You can follow this guide to get credentials from Bluemix:
 * https://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/getting_started/gs-credentials.shtml#getCreds
 */

<% if (apis['alchemy-language']) { %>var alchemy_language = watson.alchemy_language({
  api_key: '<api_key>'
});

<% } %><% if (apis['alchemy-vision']) { %>var alchemy_vision = watson.alchemy_vision({
  api_key: '<api_key>'
});

<% } %><% if (apis['alchemy-data-news']) { %>var alchemy_data_news = watson.alchemy_data_news({
  api_key: '<api_key>'
});

<% } %><% if (apis['authorization']) { %>var authorization = watson.authorization({
  username: '<username>',
  password: '<password>',
  version: 'v1'
});

<% } %><% if (apis['concept-insights']) { %>var concept_insights = watson.concept_insights({
  username: '<username>',
  password: '<password>',
  version: 'v2'
});

<% } %><% if (apis['dialog']) { %>var dialog = watson.dialog({
  username: '<username>',
  password: '<password>',
  version: 'v1'
});

<% } %><% if (apis['document-conversion']) { %>var document_conversion = watson.document_conversion({
  username:     '<username>',
  password:     '<password>',
  version:      'v1',
  version_date: '2015-12-01'
});

<% } %><% if (apis['language-translation']) { %>var language_translation = watson.language_translation({
  username: '<username>',
  password: '<password>',
  version: 'v2'
});

<% } %><% if (apis['natural-language-classifier']) { %>var natural_language_classifier = watson.natural_language_classifier({
  url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
  username: '<username>',
  password: '<password>',
  version: 'v1'
});

<% } %><% if (apis['personality-insights']) { %>var personality_insights = watson.personality_insights({
  username: '<username>',
  password: '<password>',
  version: 'v2'
});

<% } %><% if (apis['question-and-answer']) { %>var question_and_answer_healthcare = watson.question_and_answer({
  username: '<username>',
  password: '<password>',
  version: 'v1-beta',
  dataset: 'healthcare' /* The dataset can be specified when creating
                         * the service or when calling it */
});

<% } %><% if (apis['relationship-extraction']) { %>var relationship_extraction = watson.relationship_extraction({
  username: '<username>',
  password: '<password>',
  version: 'v1-beta'
});

<% } %><% if (apis['retrieve-and-rank']) { %>var retrieve = watson.retrieve_and_rank({
  url: 'https://gateway.watsonplatform.net/retrieve-and-rank/api',
  username: '<username>',
  password: '<password>',
  version: 'v1'
});

var solrClient = retrieve.createSolrClient({
  cluster_id: 'INSERT YOUR CLUSTER ID HERE',
  collection_name: 'example_collection'
});

<% } %><% if (apis['speech-to-text']) { %>var speech_to_text = watson.speech_to_text({
  username: '<username>',
  password: '<password>',
  version: 'v1'
});

<% } %><% if (apis['text-to-speech']) { %>var text_to_speech = watson.text_to_speech({
  username: '<username>',
  password: '<password>',
  version: 'v1'
});

<% } %><% if (apis['tone-analyzer']) { %>var tone_analyzer = watson.tone_analyzer({
  username: '<username>',
  password: '<password>',
  version: 'v3-beta',
  version_date: '2016-02-11'
});

<% } %><% if (apis['tradeoff-analytics']) { %>var tradeoff_analytics = watson.tradeoff_analytics({
  username: '<username>',
  password: '<password>',
  version: 'v1'
});

<% } %><% if (apis['visual-insights']) { %>var visual_insights = watson.visual_insights({
  username: '<username>',
  password: '<password>',
  version: 'v1-experimental'
});

<% } %><% if (apis['visual-recognition']) { %>var visual_recognition = watson.visual_recognition({
  username: '<username>',
  password: '<password>',
  version: 'v2-beta',
  version_date: '2015-12-02'
});

<% } %>
/**
 * This renders index.ejs found in '/views'.
 * This is the html page when you load 'http://localhost:3000/' in browser.
 */
app.get('/', function(req, res) {
  res.render('index');
});

<% if (apis['text-to-speech']) { %>/**
 * Get audio from text to speech api
 * This will download a file to the 'public/' directory.
 */
 app.post('/api/synthesize', function(req, res, next) {
   var params = {
     text: req.body.text,
     voice: 'en-US_AllisonVoice', // Optional voice
     accept: 'audio/wav'
   };
   var transcript = text_to_speech.synthesize(params);

   transcript.pipe(fs.createWriteStream('public/output.wav'));
   transcript.on('error', function(error) {
     next(error);
   });
   transcript.pipe(res);
 });<% } %>

<% if (apis['personality-insights']) { %>/**
 * Get personality profile from personality insights api
 */
 app.post('/api/profile', function(req, res, next) {
   var params = {
     text: req.body.text,
     language: 'en'
   };

   personality_insights.profile(params, function(err, response) {
     if (err)
       next(err);
     else
       res.json(response);
   });
 });<% } %>

/**
 * This handles error propagation with Express routes.
 */
require('./config/error-handler')(app);

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);
