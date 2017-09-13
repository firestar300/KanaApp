(function() {
  function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    if(window.location.hostname === 'localhost') {
      xobj.open('GET', '../kana.json', true);
    } else {
      xobj.open('GET', 'kana.json', true);
    }
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {

            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            callback(xobj.responseText);

        }
    }
    xobj.send(null);
  }

  function pickRandomProperty(obj) {
      var result;
      var count = 0;
      for (var prop in obj)
          if (Math.random() < 1/++count)
             result = prop;
      return result;
  }

  function generateQuestion(questions, linesNumber) {

    // Choix de la ligne
    var line = Math.floor(Math.random() * ((parseInt(linesNumber, 10) - 0) - 0));
    var char = pickRandomProperty(questions[line]);
    var $question = document.querySelector('.question .questionValue');
    var goodAnswer = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    var preventDouble = [];

    // console.log(char)
    // console.log(questions[0])
    // Choix si question Romanji ou pas
    
    if(Math.random() < 0.5) {
      // Question romanji
      $question.innerHTML = char;

      // Propositions de réponses
      for (var i = 0; i < 4; i++) {
        if(goodAnswer === (i + 1)) {
          document.querySelector('.answer' + (i + 1)).innerHTML = questions[line][char];
          document.getElementById('answer' + (i + 1)).setAttribute('value', char);
        } else {
          var randomizr = Math.floor(Math.random() * ((parseInt(linesNumber, 10) - 0) - 0));
          var relatedChar = pickRandomProperty(questions[randomizr]);

          while(preventDouble.indexOf(relatedChar) > -1 || relatedChar === char) {
            relatedChar = pickRandomProperty(questions[randomizr]);
          }

          document.querySelector('.answer' + (i + 1)).innerHTML = questions[randomizr][relatedChar];
          document.getElementById('answer' + (i + 1)).setAttribute('value', relatedChar);

          preventDouble.push(relatedChar);
        }
      }
    } else {
      // Question Kana
      $question.innerHTML = questions[line][char];

      // Propositions de réponses
      for (var i = 0; i < 4; i++) {
        if(goodAnswer === (i + 1)) {
          document.querySelector('.answer' + (i + 1)).innerHTML = char;
          document.getElementById('answer' + (i + 1)).setAttribute('value', char);
        } else {
          var relatedChar = pickRandomProperty(questions[Math.floor(Math.random() * ((parseInt(linesNumber, 10) - 0) - 0))]);

          while(preventDouble.indexOf(relatedChar) > -1 || relatedChar === char) {
            relatedChar = pickRandomProperty(questions[Math.floor(Math.random() * ((parseInt(linesNumber, 10) - 0) - 0))]);
          }

          document.querySelector('.answer' + (i + 1)).innerHTML = relatedChar;
          document.getElementById('answer' + (i + 1)).setAttribute('value', relatedChar);

          preventDouble.push(relatedChar);
        }
      }
    }

    return char;
  }

  // Call to function with anonymous callback
  loadJSON(function(response) {
      // Do Something with the response e.g.
      datas = JSON.parse(response);

      if(window.location.search.length > 0) {
        document.getElementById('lines').value = window.location.search.replace('?l=', '');
      }

      var linesNumber = parseInt(document.getElementById('lines').value, 10);

      var questions = [];

      document.getElementById('lines').addEventListener('change', function() {
        linesNumber = document.getElementById('lines').value;

        window.location = window.location.origin + window.location.pathname + '?l=' + linesNumber;
      });

      if(document.querySelector('body').dataset.quizz === 'hiragana') {
        for (var i = 0; i < linesNumber; i++) {
          questions.push(datas.hiragana[i]);
        }
      } else {
        for (var i = 0; i < linesNumber; i++) {
          questions.push(datas.katakana[i]);
        }
      }

      var answer = generateQuestion(questions, linesNumber);

      document.getElementById('submit').addEventListener('click', function() {
        if(answer == document.querySelector('.answer:checked').getAttribute('value')) {
          document.querySelector('.alert-success').style.display = 'block';
        } else {
          document.querySelector('.alert-danger').style.display = 'block';
        }

        setTimeout(function() {
          document.querySelectorAll('.alert').forEach(function(el) {
            el.style.display = 'none';
          });

          answer = generateQuestion(questions, linesNumber);
        }, 2000);
      });
  });
}());