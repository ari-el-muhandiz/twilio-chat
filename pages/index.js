import { Row, Col } from 'antd';
import 'antd/dist/antd.css';
import fetch from 'isomorphic-unfetch';
import { useEffect, useState } from 'react';
import { cloneDeep, get, isEmpty } from 'lodash';
import ChatComponent from '../components/chat';
import moment from 'moment';
const Chat = require('twilio-chat');

const Home =  () => {
  const [currentChannel, setCurrentChannel] = useState({});
  const [messageList, setMessageList] = useState([]);
  const [isLoadingChannel, setLoadingChannel] = useState(false);
  const [message, setMessage] = useState({});
  const formatMessage = (message) => {
    return {
        author: message.author,
        text: message.body,
        date: moment(message.createdAt).format('DD-MM-YYYY HH:mm')
      }
  }
  const addMessageToList = (message) => {
    setMessage(formatMessage(message));
  }
  const fetchToken = async() => {
    const resp = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
        identity: 'admin'
      })
    });
    const { token } = await resp.json();
    return token;
  }
  const initChannel = async() => {
    const token = await fetchToken();
    let client = await Chat.Client.create(token);
    let generalChannel = null;
    const channelObject = await client.getPublicChannelDescriptors();
    const channels = channelObject.items;
    for(let i=0; i  < channels.length; i++) {
      if (channels[i].uniqueName === 'demo') {
        generalChannel = channels[i];
        break;
      }
    }
    if (!generalChannel) {
      generalChannel = await client.createChannel({
        uniqueName: 'demo',
        friendlyName: 'admin'
      });
    }
    //leave first
    if (!isEmpty(currentChannel)) {
      currentChannel.leave();
    }
    const _channel = await client.getChannelBySid(generalChannel.sid);
    const myChannel = get(_channel, 'channelState.status', '') !== 'joined' ? await _channel.join() : _channel;
    const messages = await myChannel.getMessages();
    console.log(messages);
    const totalMessages = get(messages, 'items.length', []);
    for (let i = 0; i < totalMessages; i++) {
      const message = messages.items[i];
      setMessage(formatMessage(message));
    }
    myChannel.on('messageAdded', addMessageToList);
    console.log('channel join', myChannel);
    setCurrentChannel(myChannel);
    setLoadingChannel(false);
  }
  useEffect(() => {
    setLoadingChannel(true);
    initChannel();
    // generalChannel.on('typingStarted', showTypingStarted);
    // generalChannel.on('typingEnded', hideTypingStarted);
    // generalChannel.on('memberJoined', notifyMemberJoined);
    // generalChannel.on('memberLeft', notifyMemberLeft);
    return () => {
      if (!isEmpty(currentChannel)) {
        currentChannel.leave();
      }
    }
  }, [])
  useEffect(() => {
    const temp = cloneDeep(messageList);
    temp.push(message);
    setMessageList(temp);
  }, [message]);
  const onSubmit = (message) => {
    if (!isEmpty(currentChannel)) {
      currentChannel.sendMessage(message);
    }
  }
  return (
  <>
    <Row>
      <Col span={24}>
        <ChatComponent onSubmit={onSubmit} messageList={messageList} isLoadingChannel={isLoadingChannel} />
      </Col>
    </Row>
  </>)
}

export default Home;