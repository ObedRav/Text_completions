import { useState, useEffect } from 'react';

const App = () => {
  const [ value, setValue ] = useState("")
  const [ message, setMessage ] = useState(null)
  const [ prevChats, setPrevChats ] = useState([])
  const [ currentTitle, setCurrentTitle ] = useState(null)

  const handleClick = (title) => {

    setCurrentTitle(title);
    setMessage(null);
    setValue("");

  }

  const createNewChat = () => {

    setMessage(null);
    setValue("");
    setCurrentTitle(null);

  }

  const getMessages = async () => {

    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json();

      setMessage(data.choices[0].message);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value)
    }

    if (currentTitle && value && message) {
      setPrevChats(prevChats => (
        [...prevChats, {
          title: currentTitle,
          role: "user",
          content: value
        }, {
          title: currentTitle,
          role: message.role,
          content: message.content
        }]
      ))
    }
  }, [message, currentTitle])


  const currentChat = prevChats.filter(chat => chat.title === currentTitle)
  const uniqueTitles = Array.from(new Set(prevChats.map(prevChat => prevChat.title))) 

  return (
    <div className="App">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>

        <ul className="history">
          {uniqueTitles?.map((title, index) => <li key={index} onClick={() => handleClick(title)}>{title}</li>)}
        </ul>

          <nav>
            <p>Made by Obed</p>
          </nav>
      </section>
      <section className="main">

        {!currentTitle && <h1>ObedGPT</h1>}

        <ul className="feed">
          {currentChat?.map((chat, index) => <li key={index}>
            <p className='role'>{chat.role}</p>
            <p>{chat.content}</p>
          </li>)}
        </ul>

        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}>➢</div>
          </div>
          <p className="info">
            Chat GPT Mar 14 Version. Free Research Preview. <br />
            Our goal is to make AI systems more natural and safe to interact with.
            Your feedback will help us improve.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
