import { useEffect, useRef, useState } from "react";
import "./App.css";
import axios from "axios";

const YOU = "you";
const AI = "ai";
function App() {
  const bottomRef = useRef(null);
  const inputRef = useRef();
  const [qna, setQna] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateQNA = (from, value) => {
    setQna((qna) => [...qna, { from, value }]);
  };

  const handleSend = () => {
    const question = inputRef.current.value;
    updateQNA(YOU, question);
    inputRef.current.value = "";
    setLoading(true);
    axios
      .post("http://localhost:8000/chat", {
        question,
      })
      .then((response) => {
        updateQNA(AI, response.data.answer);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderContent = (qna) => {
    const value = qna.value;
    if (Array.isArray(value)) {
      return value.map((v) => <p className="message-text">{v}</p>);
    }
    return <p className="message-text">{value}</p>;
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [qna]);
  return (
    <main className="container overflow-auto">
      <div className="chats overflow-auto">
        {qna.map((qna) => {
          if (qna.from === YOU) {
            return (
              <div className="send chat">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2202/2202112.png"
                  alt=""
                  className="avtar"
                />
                <p>{renderContent(qna)}</p>
              </div>
            );
          }
          return (
            <div className="recieve chat">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                alt=""
                className="avtar"
              />
              <p>{renderContent(qna)}</p>
            </div>
          );
        })}

        {loading && (
          <div className="recieve chat">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
              alt=""
              className="avtar"
            />
            <p>Typing...</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          ref={inputRef}
          className="form-control col"
          placeholder="Type Something"
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleSend();
            }
          }}
        />
        <button disabled={loading} className="btn btn-success" onClick={handleSend}>
          Send
        </button>
      </div>
    </main>
  );
}

export default App;