
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
    this.friendList = [];
  }

  init() {
    this.fetch();
    this.connectEventListeners();
    //setInterval(() => { /*this.clearMessages();*/ this.connectEventListeners(); /*this.fetch();*/ }, 1000);
  }
    
  connectEventListeners() {
    var context = this;
    $('.sendMessage').on('click', function(event) {
      //get message from input box
      var textMessage = $('.inputBox').val();
      // console.log('hey',textMessage)
      //get username
      //get time
      //construct into message object
      context.send(message);
    });

    $('.clearChat').on('click', function(event) {
      context.clearMessages();
    });

    $('.username').on('click', function(event) {
      var user = $(this).data('username');
      context.handleUsernameClick(user);
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
        console.log('chatterbox: Message received', data);
        context.renderMessage(data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message', data);
      }
    });
  }

  renderMessage(messageInfo) {
    var messages = messageInfo.results;
    var $chatBox = $('#chats');
    for (var i = (messages.length - 1); i >= 0; i--) {
      var message = messages[i];
      var $messageBlock = $('<div class="messageBlock"></div>');
      var $username = $('<h3 class="username" data></h3>');
      $username.data('username', message.username);
      $username.text(message.username);
      var $text = $('<p></p>');
      $text.text(message.text);
      $messageBlock.append($username);
      $messageBlock.append($text);
      $chatBox.append($messageBlock);
    }
    // this.connectEventListeners();

    
  }

  clearMessages() {
    $('#chats').empty();
  }

  renderRoom(roomName) {
    var $node = $('<p></p>');  //
    $node.text(roomName);
    $('#roomSelect').append($node);
  }

  handleUsernameClick(username) {
    this.friendList[username] = true;
  }


} // end of class


var app = new App();


