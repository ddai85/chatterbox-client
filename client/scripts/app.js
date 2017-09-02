
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
    this.messageSet = new Set();
    this.setSize;
    this.dataStream;
    this.currentRoom;
    this.currentUser;
  }

  init() {
    var context = this;
    this.fetch();
    this.connectEventListeners();
    this.getUserName();
    // setInterval(function() {
    //   context.upDateFetch();
    // }, 1000);
    //setInterval(() => { /*this.clearMessages();*/ this.connectEventListeners(); /*this.fetch();*/ }, 1000);
  }
    
  connectEventListeners() {
    var context = this;
    $('.sendMessage').on('click', function(event) {
      var message = context.makeMessage();
      context.addNewMessage(message);
      context.send(message);
    });

    $('.addNewRoom').on('click', function(event) {
      var room = $('.newRoom').val();
      context.rooms.add(room);
      context.createRoomList();
      context.handleRoomNameClick(room);
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
    var query = '?order="-createdAt"';
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: context.server + query,
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

  upDateFetch() {
    var context = this;
    var query = '?order="-createdAt"&limit=3';
    $.ajax({
      url: context.server + query,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        // console.log('chatterbox: Message received', data);
        context.dataStream = data; 
        for (var i = 0; i < data.results.length; i++) {
          context.messageSet.add(data.results[i].objectId);
        } 
        console.log(data);
        var difference = context.messageSet.size - context.setSize;
        console.log(difference);
        
        if (difference > 0) {
          for (var i = 0; i < difference; i++) {
            context.addNewMessage(context.dataStream.results[i]);
          }
        }
        context.setSize = context.messageSet.size;

        
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
    for (var i = 0; i <= (messages.length - 1); i++) {
      var message = messages[i];
      var $messageBlock = $('<div class="messageBlock"></div>');
      var $username = $('<h3 class="username" data></h3>');
      $username.data('username', message.username);
      $username.text(message.username);
      var $text = $('<p></p>');
      $text.text(message.text);
      var $timeStamp = $('<h5 class="time" data></h5>');
      $timeStamp.text(message.createdAt);
      $messageBlock.append($username);
      $messageBlock.append($text);
      $messageBlock.append($timeStamp);    
      $chatBox.append($messageBlock);
      this.rooms.add(message.roomname);
      context.messageSet.add(message.objectId);
    }
    this.setSize = context.messageSet.size;
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
    var $timeStamp = $('<h5 class="time" data></h5>');
    $timeStamp.text(message.createdAt);
    $messageBlock.append($username);
    $messageBlock.append($text);
    $messageBlock.append($timeStamp);
    $chatBox.prepend($messageBlock);
  }

  clearMessages() {
    $('#chats').empty();
  }

  addToRoomMenu(roomName) {
    var $node = $('<p class="room" data></p>');  
    $node.text(roomName);
    $node.data('roomname', roomName);
    $('#roomSelect').append($node);
  }

  addToFriendsList(friend) {
    var $node = $('<p class="friend" data></p>');  
    $node.text(friend);
    $node.data('friend', friend);
    $('#friendsList').append($node);
  }

  handleUsernameClick(username) {
    this.friendList[username] = true;
    this.addToFriendsList(username);
  }


  createRoomList() {
    var context = this;
    $('#roomSelect').empty();
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
    $('.roomTitle').empty();
    var $roomTitle = $('<h2 class="roomTitle"></h2>');
    $roomTitle.text(this.currentRoom);
    $('.putTitle').append($roomTitle);
  }


} // end of class


var app = new App();


