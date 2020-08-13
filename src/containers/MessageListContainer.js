import React, { useState, useEffect } from 'react';
import MessageList from '../components/chat/MessageList';
// import * as grpc from 'grpc';
// import * as protoLoader from '@grpc/proto-loader'

const MessageListContainer = () => {

    const [name, setName] = useState("");
    const [msg, setMsg] = useState("");
    const [chat, setChat] = useState([{ name: "ddd", msg: "ddddd" }]);

    const { ChatClient } = require('../protos/chat_grpc_web_pb');
    const { Message } = require('../protos/chat_pb.js');

    var client= new ChatClient('http://localhost:9090', null, null);

    useEffect(() => {
        // dispatch(readSearch(tag));
        // 언마운트될 때 리덕스에서 포스트 데이터 없애기

        let streamRequest = new Message();
        streamRequest.setUser("박건후");
        
        // client.join(() => {
        //     streamRequest,
        //     {"custom-header-1": "value1"}
        // });

        // {"custom-header-1": "value1"}
        var stream = client.join(
            streamRequest,
            null
        );

        stream.on('data', function(response) {
            console.log(response);
            setChat(c=>[...c, { name : response.array[0], msg : response.array[1] }]);
            // setChat([...chat, { name : response.array[0], msg : response.array[1] }]);
        });

        return () => {
            //dispatch(unloadPost());
        };
        
    },[]);
    const onNameChange = e => {
        setName(e.target.value);
    }

    const onMsgChange = e => {
        setMsg(e.target.value);
    }

    const onMessageSubmit = () => {
        setMsg("");
        const request = new Message();
        request.setText(msg);
        request.setUser(name);
        client.send(request, {}, (err, response) => {
            if (response == null) {
              console.log(err)
            }else {
              console.log(response)
            }
        });
        // setChat([...chat, { name, msg }]);
    }

    return (
        <div>
            <span>Nickname</span>
            <input
                name="name"
                onChange={onNameChange}
                value={name}
            />
            <br />
            <span>Message</span>
            <input
                name="msg"
                onChange={onMsgChange}
                value={msg}
            />
            <button onClick={onMessageSubmit}>Send</button>
            <MessageList chat={chat} />
        </div>
    );
};

export default MessageListContainer;
