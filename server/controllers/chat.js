const Message = require("../models/Message.js");

class ChatController {
    //api/chat/saveMessage
    saveMessage(req, res, next) {
        const newMessage = new Message(req.body);
        newMessage.save()
        .then((messages, err) => {
            res.status(200).json(messages);
        })
        .catch((err) => {
            res.status(500).json(err);
        })
    }

    //api/chat/getMessage?sender=ngocnd&receiver=minhpv
    getMessage(req, res) {
        Message.find({$or: [{
            sender: req.query.sender,
            receiver: req.query.receiver,
        }, {
            receiver: req.query.sender,
            sender: req.query.receiver,
        }]})
        .then((messages, err) => {
            for(let i = 0; i < messages.length; i++){
                messages[i] = {
                    sender: messages[i].sender,
                    receiver: messages[i].receiver,
                    text: messages[i].text,
                }
            }
            res.status(200).json(messages);
        })
        .catch((err) => {
            res.status(500).json(err);
        })
    }

    //api/chat/getListMessage?sender=ngocnd
    getListMessager(req, res) {
        // Message.find({
        //     sender: req.query.sender,
        // })
        Message.find({$or: [{
            sender: req.query.sender,
        }, {
            receiver: req.query.sender,

        }]})
        .then((messages, err) => {
            var receiver = [];
            for(let i = messages.length - 1; i >= 0; i--) {
                if(req.query.sender == messages[i].sender){
                    receiver.push(messages[i].receiver)
                } else {
                    receiver.push(messages[i].sender)
                }
                
            }
            const unique = Array.from(new Set(receiver))
            console.log(unique)
            res.status(200).send(unique);
        })
        .catch((err) => {
            res.status(500).json(err);
        })
    }
}

module.exports = new ChatController()