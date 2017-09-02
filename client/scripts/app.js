
$(document).ready(function() {
  app.init();
});

// var message = {
//   username: 'Mel Brooks',
//   text: 'It\'s good to be the king',
//   roomname: 'lobby'
// };


class App {
  constructor() {
    console.log('hello1');
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
    this.friendList = [];
    this.rooms = new Set();
    this.dataStream;
    this.currentRoom;
    this.currentUser;
  }

  init() {
    this.fetch();
    this.connectEventListeners();
    this.getUserName();
    //setInterval(() => { /*this.clearMessages();*/ this.connectEventListeners(); /*this.fetch();*/ }, 1000);
  }
    
  connectEventListeners() {
    var context = this;
    $('.sendMessage').on('click', function(event) {
      var message = context.makeMessage();
      context.addNewMessage(message);
      context.send(message);
    });

    $('.clearChat').on('click', function(event) {
      context.clearMessages();
    });



  }

  send(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent', message);
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
        context.dataStream = data;
        context.createRoomList();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message', data);
      }
    });
  }

  renderMessage(messageInfo) {
    var context = this;
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
      this.rooms.add(message.roomname);
    }

    $('.username').on('click', function(event) {
      var user = $(this).data('username');
      context.handleUsernameClick(user);
    });

    
  }
  
  addNewMessage(message) {
    var $chatBox = $('#chats');
    console.log('adding new message');
    var $messageBlock = $('<div class="messageBlock"></div>');
    var $username = $('<h3 class="username" data></h3>');
    $username.data('username', message.username);
    $username.text(message.username);
    var $text = $('<p></p>');
    $text.text(message.text);
    $messageBlock.append($username);
    $messageBlock.append($text);
    $chatBox.prepend($messageBlock);
  }

  clearMessages() {
    $('#chats').empty();
  }

  addToRoomMenu(roomName) {
    var $node = $('<p class="room" data></p>');  //
    $node.text(roomName);
    $node.data('roomname', roomName);
    $('#roomSelect').append($node);
  }

  handleUsernameClick(username) {
    this.friendList[username] = true;
  }

  createRoomList() {
    var context = this;
    for (var i of this.rooms) {
      this.addToRoomMenu(i);
    }
    
    $('.room').on('click', function(event) {
      console.log('its working');
      var $roomName = $(this).data('roomname');
      context.handleRoomNameClick($roomName);
    });
  }

  getUserName() {
    var url = window.location.href;
    var thisUsername = url.split('=')[1];
    this.currentUser = thisUsername;
  }

  makeMessage() {
    var textMessage = $('.inputBox').val();
    var thisUsername = this.currentUser;
    var date = new Date();
    var roomname = this.currentRoom;

    var message = {
      username: thisUsername,
      text: textMessage,
      roomname: roomname
    };
    this.dataStream.results.push(message);
    return message;
  }

  handleRoomNameClick(roomname) {
    var roomMessages = this.dataStream.results.filter(function(message) {
      return message.roomname === roomname;
    });
    var obj = {results: roomMessages};
    this.clearMessages();
    this.renderMessage(obj);
    this.currentRoom = roomname;
  }


} // end of class


var app = new App();


