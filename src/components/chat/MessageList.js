import React from 'react';

const MessageList = ({ chat }) => {

    return (
        <div>
            {chat.map(({ name, msg }, idx) => (
                <div key={idx}>
                    <span style={{ color: "green" }}>{name}: </span>

                    <span>{msg}</span>
                </div>
            ))}
        </div>
    );
};

export default MessageList;
