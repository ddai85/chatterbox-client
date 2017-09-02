
$(document).ready(function() {
  app.init();
});

var message = {
  username: 'Mel Brooks',
  text: 'It\'s good to be the king',
  roomname: 'lobby'
};


class App {
  constructor() {
    console.log('hello1');
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
    // this.init();
  }

  init() {
    this.connectEventListeners();
    this.fetch();
  }
    
  connectEventListeners() {
    var context = this;
    $('.sendMessage').on('click', function(event) {
      console.log('hello');
      context.send(message);
    });
  }

  send(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: message,
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });  
  }

  fetch() {
    var context = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: context.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message received');
        context.renderMessages(data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message', data);
      }
    });
  }

  renderMessages(messageInfo) {
    var count = 0;
    console.log();
    var messages = messageInfo.results;
    var $chatBox = $('.chat');
    console.log($chatBox);
    for (var i = messages.length - 1; i >= 0; i--) {
      count++;
      if (count === 7) {
        debugger;
      }
      var message = messages[i];
      if (typeof message.text === 'string') {
        var $node = $(`<p>${message.text}</p>`);  //
        $chatBox.append($node);
      }
    }

  }

  clearMessages() {
    
  }





} // end of class


var app = new App();

