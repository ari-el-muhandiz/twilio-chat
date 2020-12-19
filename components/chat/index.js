import PropTypes from 'prop-types';
import { useState } from 'react';

const Chat = ({ onSubmit, messageList, isLoadingChannel }) => {
   const [message, setMessage] = useState('');
   const submitForm = (e) => {
       onSubmit(message);
       setMessage('');
       e.preventDefault();
   }
   return (
    <section className="msger">
        <header className="msger-header">
        <div className="msger-header-title">
            <i className="fas fa-comment-alt"></i> SimpleChat
        </div>
        <div className="msger-header-options">
            <span><i className="fas fa-cog"></i></span>
        </div>
        </header>
        {isLoadingChannel ? (
            <div className="msger-chat">Channel is Loading</div>
        ) : (
            <>
            <main className="msger-chat"> 
                {messageList.map((message, i) => (
                    <div key={i} className={`msg ${message.author === 'admin' ? 'right-msg' : 'left-msg'}`}>
                        <div className="msg-bubble">
                            <div className="msg-info">
                                <div className="msg-info-name">{message.author}</div>
                                <div className="msg-info-time">{message.date}</div>
                            </div>

                            <div className="msg-text">
                                {message.text}
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            <form className="msger-inputarea" onSubmit={submitForm}>
                <input type="text" value={message} 
                onChange={(e) => setMessage(e.target.value)}
                className="msger-input" placeholder="Enter your message..." />
                <button type="submit" className="msger-send-btn">Send</button>
            </form>
        </>
        )}
        </section>
   ) 
}

Chat.propTypes = {
  onSubmit: PropTypes.func,
  messageList: PropTypes.arrayOf(PropTypes.any),
  isLoadingChannel: PropTypes.bool
};
Chat.defaultProps = {
  onSubmit: () => {},
  messageList: [],
  isLoadingChannel: false
}
export default Chat