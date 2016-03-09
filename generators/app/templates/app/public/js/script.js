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

$(document).ready(function () {

  /* Variables */

  <% if (apis['text-to-speech']) { %>var textToSpeechPlayer = document.querySelector('.js-text-to-speech-player');
  <% } %>

  /* Functions */

  /**
   * Converts a js object to a string.
   * @param  {Object} obj
   * @return {String} js obj in string form
   */
  function jsonToString(obj) {
    return JSON.stringify(obj, null, 2);
  }

  <% if (apis['personality-insights']) { %>/**
   * Send text through Personality Insights
   */
  function makePersonalityProfile() {
    var parameters = {
      text: $('.js-personality-insights-text-input').val()
    };

    $.post('/api/profile', parameters, function(response) {
      console.log(response);
      $('.js-personality-insights-text-output').val(jsonToString(response));
    });
  }

  <% } %><% if (apis['text-to-speech']) { %>/**
   * Updates and plays the Text to Speech audio player with latest
   * audio file.
   */
   function reloadTextToSpeechPlayer() {
     textToSpeechPlayer.pause();
     textToSpeechPlayer.src = '/output.wav';
     textToSpeechPlayer.load();
     textToSpeechPlayer.play();
   }

   <% } %><% if (apis['text-to-speech']) { %>/**
   * Send text through Text to Speech
   */
  function synthesizeTextToSpeech() {
    var parameters = {
      text: $('.js-text-to-speech-text-input').val()
    };

    $.post('/api/synthesize', parameters, function(response) {
      console.log(response);
      reloadTextToSpeechPlayer();
    });
  }

  <% } %>

  /* Events */

  <% if (apis['personality-insights']) { %>/**
   * Activates personality insights
   */
  $('.js-personality-insights-submit-button').click(function() {
    makePersonalityProfile();
  });

  <% } %><% if (apis['text-to-speech']) { %>/**
   * Activates text to speech synthesis
   */
  $('.js-text-to-speech-submit-button').click(function() {
    synthesizeTextToSpeech();
  });

  <% } %>
});
