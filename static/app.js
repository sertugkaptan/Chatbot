class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
        }
        this.flag = 0;
        this.state = false;
        this.messages = [];
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))



        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value

        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);
        if(text1 == "Goodbye"){
            this.flag = 1
            let msg2 = { name: "Sam",  message: "What do you think of the Bot using 1-5 rating!"};
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''
        }
        else if(this.flag == 1){
            this.flag = 0
            fetch('http://127.0.0.1:5000/questionare', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
           })
          .then(r => r.json())
          .then(r => {
            let msg2 = { name: "Sam",  message: r.answer  };

            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''
           }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
         });
        }
        else{
        fetch('http://127.0.0.1:5000/predict', {

            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            let msg2 = { name: "Sam", message: r.answer };

            this.messages.push(msg2);
            this.updateChatText(chatbox)

            if(msg2.message == "Redirecting to student population piechart...")
            {
             setTimeout(function(){
                window.location.replace("/piechart")
             }, 3000);
            }
            if(msg2.message == "Redirecting to transportation...")
            {
            console.log("1")
             setTimeout(function(){
                window.location.replace("/transportation")
             }, 3000);
            }
            if(msg2.message == "Redirecting to Oibs...")
            {
            console.log("1")
             setTimeout(function(){
                window.location.replace("http://oibs.eul.edu.tr/ukuapp/")
             }, 3000);
            }
            if(msg2.message == "Redirecting to Moodle...")
            {
            console.log("1")
             setTimeout(function(){
                window.location.replace("https://moodle.eul.edu.tr/login/index.php")
             }, 3000);
            }

            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
         });
        }
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sam")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}


const chatbox = new Chatbox();
chatbox.display();