// Contains the functions that modify the chat content based on user interactions

/**
 * Inserts a new chat to the existing conversation. Also sends a GET request to fetch the chatbot response
 * @param {event} - Captures the click event on the Send button
 */

function insertChat(event) {
    var input = event.target;
    var temp = input;
    var msg = document.getElementById(input.parentNode.children[0].id).value;
    var timeStamp = returnTimeStamp();
    var name = input.parentNode.parentNode.id;
    if (msg === '') {
        alert('Type something!');
        return;
    }
    chatData.push({
        name,
        timeStamp,
        msg,
    });
    sessionStorage.setItem('chatHistory', JSON.stringify(chatData));
    updateChats({name, timeStamp, msg});
    sendGetRequest(msg, chatBotResponse);
    document.getElementById(input.parentNode.children[0].id).value = "";
}
/**
 * Appends a row to the existing chatbox conversation and clears the typed message 
 * @param {chatDetails} - Contains the details of the last message : name, timeStamp and message
 */
function updateChats(chatDetails) {
    var chats = document.getElementsByClassName('chatBox');
    if(chatDetails.name === chats[0].id) {
        chats[0].children[1].appendChild(createChatRow(chatDetails, true));
    } else {
        chats[0].children[1].appendChild(createChatRow(chatDetails, false));
    }
    chats[0].children[1].scrollTop = chats[0].children[1].scrollHeight;
}
var id = {value : 63906}

/**
 * Sends a GET request with the last user message to fetch the chatbot's response
 * @param {message} - Contains the user's message
 * @param {callback} - the function to be called in case of a successful request
 */

function sendGetRequest(message, callback) {
    try{
        $.ajax(
            {
                url: 'https://www.personalityforge.com/api/chat/',
                type: 'GET',
                data: {
                    apiKey:'6nt5d1nJHkqbkphe', 
                    chatBotID: id.value , 
                    externalID: 'Promit', 
                    message: message,
                },
                success: callback,
                error: pollMessage.bind(this, message),
            }
        )
    } catch(err) {
        console.log(err);
    }
   
}

/**
 * Captures the response of the chatbot and updates the conversation
 * @param {response} - Contains the reponse of the request
 * @param {status} - contains the status of the request
 * @param {xhr} - contains the details of the xhr call
 */

function chatBotResponse(response, status, xhr) {
    var response = JSON.parse(response);
    if(status === 'success') {
         var currentChat = {};
         currentChat.name = response.message.chatBotName;
         currentChat.msg = response.message.message;
         currentChat.timeStamp = returnTimeStamp();
         chatData.push(currentChat);
         sessionStorage.setItem('chatHistory', JSON.stringify(chatData));
         updateChats(currentChat);
    } else {
        alert('Oops! There seems to be an issue. Please try again')
    }

}
/**
 * Creates a timeStamp for a chat message
 */
function returnTimeStamp() {
    var tempDate = new Date();
    var timeStamp = tempDate.getHours() + ":" + tempDate.getMinutes(); 
    return timeStamp;
}
/**
 * Starts polling for a chatbot response in case of a server error
 * @param {message} - Contains the message to be sent to the server
 **/
function pollMessage(message) {
    setTimeout(function(){
        sendGetRequest(message, chatBotResponse);
    }, 5000)
}