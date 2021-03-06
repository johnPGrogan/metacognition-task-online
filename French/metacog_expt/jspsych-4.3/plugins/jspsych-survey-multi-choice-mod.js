/**
 * jspsych-survey-multi-choice
 * a jspsych plugin for multiple choice survey questions
 *
 * Shane Martin
 *
 * documentation: docs.jspsych.org
 *
 */

	
(function($) {
jsPsych['survey-multi-choice-mod'] = (function() {

  var plugin = {};

  plugin.create = function(params) {
  
  
     var trials = [];
      for (var i = 0; i < params.questions.length; i++) {
        trials.push({
          preamble: (typeof params.preamble === 'undefined') ? "" : params.preamble[i],
          questions: params.questions[i],
          options: params.options[i],
		      required: (typeof params.required === 'undefined') ? null: params.required[i],
          horizontal: (typeof params.horizontal === 'undefined') ? false : params.horizontal[i]
        });
      }
      return trials;
    };
	

  plugin.trial = function(display_element, trial) {

    var plugin_id_name = "jspsych-survey-multi-choice";
    var plugin_id_selector = '#' + plugin_id_name;
    var _join = function( /*args*/ ) {
      var arr = Array.prototype.slice.call(arguments, _join.length);
      return arr.join(separator = '-');
    }

    // trial defaults
    //trial.preamble = typeof trial.preamble == 'undefined' ? "" : trial.preamble;
    //trial.required = typeof trial.required == 'undefined' ? null : trial.required;
    //trial.horizontal = typeof trial.required == 'undefined' ? false : trial.horizontal;

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // form element
    var trial_form_id = _join(plugin_id_name, "form");
    display_element.append($('<form>', {
      "id": trial_form_id
    }));
    var $trial_form = $("#" + trial_form_id);
	
	

    // show preamble text
    var preamble_id_name = _join(plugin_id_name, 'preamble');
    $trial_form.append($('<div>', {
      "id": preamble_id_name,
      "class": preamble_id_name
    }));
    $('#' + preamble_id_name).html(trial.preamble);
	
	

    // add multiple-choice questions
    for (var i = 0; i < trial.questions.length; i++) {
      // create question container
      var question_classes = [_join(plugin_id_name, 'question')];
	  
	  
     if (trial.horizontal) {
        question_classes.push(_join(plugin_id_name, 'horizontal'));
     }
	  

      $trial_form.append($('<div>', {
        "id": _join(plugin_id_name, i),
        "class": question_classes.join(' ')
      }));

      var question_selector = _join(plugin_id_selector, i);

      // add question text
      $(question_selector).append(
        '<p class="' + plugin_id_name + '-text survey-multi-choice">' + trial.questions[i] + '</p>'
      );

      // create option radio buttons
      for (var j = 0; j < trial.options[i].length; j++) {
        var option_id_name = _join(plugin_id_name, "", i, j),
          option_id_selector = '#' + option_id_name;

        // add radio button container
        $(question_selector).append($('<div>', {
          "id": option_id_name,
          "class": _join(plugin_id_name, 'option')
        }));

        // add label and question text
        var option_label = '<label class="' + plugin_id_name + '-text">' + trial.options[i][j] + '</label>';
        $(option_id_selector).append(option_label);

        // create radio button
        var input_id_name = _join(plugin_id_name, 'response', i);
        $(option_id_selector + " label").prepend('<input type="radio" name="' + input_id_name + '" value=' + [j+1] + '>');
      }
	  
	  //edit the value part above for to change the responses saved. now it is j+1

      if (trial.required && trial.required[i]) {
        // add "question required" asterisk
     //   $(question_selector + " p").append("<span class='required'>*</span>")

        // add required property
        $(question_selector + " input:radio").prop("required", true);
      }
    }

	
      // add submit button trial_form
      $trial_form.append($('<button>', {
       // 'id': 'jspsych-survey-multi-choice',
	//	'type': 'submit',
     //   'class': 'jspsych-survey-multi-choice'
		
	  'type': 'submit',
      'id': plugin_id_name + '-next',
      'class': plugin_id_name + ' jspsych-btn',
    
      }));
	
     $("#jspsych-survey-multi-choice-next").html('Next');
      $trial_form.submit(function(event) {
		  
		  
   //   event.preventDefault();
   
   
       // add submit button
 //   $trial_form.append($('<input>', {
  //    'type': 'submit',
  //    'id': plugin_id_name + '-next',
  //    'class': plugin_id_name + ' jspsych-btn',
  //    'value': 'Next'
  //  }));
	

  //  $trial_form.submit(function(event) {

      event.preventDefault();

      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;
		
		

      // create object to hold responses-new
      var question_data = {};
      $("div." + plugin_id_name + "-question").each(function(index) {
        var id = "Q" + index;
        var val = $(this).find("input:radio:checked").val();		
        var obje = {};
        obje[id] = val;
        $.extend(question_data, obje);
      });


	  
      // save data
  //    var trial_data = {
   //     "rt": response_time,
   //     "responses": JSON.stringify(question_data)
   //   };

   
        jsPsych.data.write({
        "rt": response_time,
        "ratingTask1": JSON.stringify(question_data)
      });

   
   
   
      display_element.html('');

      // next trial
      jsPsych.finishTrial();
    });

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
})(jQuery);