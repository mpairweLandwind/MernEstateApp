import { useState } from 'react'
import './chat.scss'

function Chat() {
    const [chat, setChat] = useState(true)
    return (
        <div className='chat'>
            <div className="messages">
                <h1>Messages</h1>
                <div className="message">
                    <img src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
                    <span>John Doe</span>
                    <p>
                        Je voulais savoir a propos...
                    </p>
                </div>
                <div className="message">
                    <img src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
                    <span>John Doe</span>
                    <p>
                        Je voulais savoir a propos...
                    </p>
                </div>
                <div className="message">
                    <img src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
                    <span>John Doe</span>
                    <p>
                        Je voulais savoir a propos...
                    </p>
                </div>
                <div className="message">
                    <img src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
                    <span>John Doe</span>
                    <p>
                        Je voulais savoir a propos...
                    </p>
                </div>
                <div className="message">
                    <img src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
                    <span>John Doe</span>
                    <p>
                        Je voulais savoir a propos...
                    </p>
                </div>
                <div className="message">
                    <img src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
                    <span>John Doe</span>
                    <p>
                        Je voulais savoir a propos...
                    </p>
                </div>
            </div>
            {chat && (
                <div className="chatBox">
                    <div className="top">
                        <div className="user">
                            <img
                                src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                alt=""
                            />
                            John Doe
                        </div>
                        <span className="close" onClick={() => setChat(null)}>x</span>
                    </div>
                    <div className="center">
                        <div className="chatMessage">
                            <p>Je voulais vous demander a propos de votre appartement si il est dispo</p>
                            <span>1 hour ago</span>
                        </div>
                        <div className="chatMessage own">
                            <p>Je voulais vous demander a propos de votre appartement si il est dispo</p>
                            <span>1 hour ago</span>
                        </div>
                        <div className="chatMessage own">
                            <p>Je voulais vous demander a propos de votre appartement si il est dispo</p>
                            <span>1 hour ago</span>
                        </div>
                        <div className="chatMessage">
                            <p>Je voulais vous demander a propos de votre appartement si il est dispo</p>
                            <span>1 hour ago</span>
                        </div>
                        <div className="chatMessage own">
                            <p>Je voulais vous demander a propos de votre appartement si il est dispo</p>
                            <span>1 hour ago</span>
                        </div>
                        <div className="chatMessage">
                            <p>Je voulais vous demander a propos de votre appartement si il est dispo</p>
                            <span>1 hour ago</span>
                        </div>
                        <div className="chatMessage own">
                            <p>Je voulais vous demander a propos de votre appartement si il est dispo</p>
                            <span>1 hour ago</span>
                        </div>
                        <div className="chatMessage">
                            <p>Je voulais vous demander a propos de votre appartement si il est dispo</p>
                            <span>1 hour ago</span>
                        </div>
                    </div>
                    <div className="bottom">
                        <textarea></textarea>
                        <button>Send</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Chat