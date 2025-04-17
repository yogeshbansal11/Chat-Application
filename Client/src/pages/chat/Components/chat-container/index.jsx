import React from 'react'
import ChatHeader from './Components/chat-header'
import MessageContainer from './Components/message-container'
import MessageBar from './Components/message-bar'

const ChatContainer = () => {
  return (
    <div className='fixed top-0 h-[100vh] w-[100vh] bg-[#1c1d25] flex flex-col md:static md:flex-1'>
      <ChatHeader/>
      <MessageContainer/>
      <MessageBar/>
    </div>
  )
}

export default ChatContainer
