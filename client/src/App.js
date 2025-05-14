import React, { useEffect, useRef, useState } from "react";
import socket from "./socket";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const drawFromSocket = ({ x0, y0, x1, y1 }) => {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.stroke();
      context.closePath();
    };

    socket.on("draw", drawFromSocket);
    socket.on("chat", (msg) => setMessages((prev) => [...prev, msg]));

    return () => {
      socket.off("draw", drawFromSocket);
      socket.off("chat");
    };
  }, []);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    canvasRef.current.lastX = e.clientX - rect.left;
    canvasRef.current.lastY = e.clientY - rect.top;
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(canvas.lastX, canvas.lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();

    socket.emit("draw", {
      x0: canvas.lastX,
      y0: canvas.lastY,
      x1: x,
      y1: y
    });

    canvas.lastX = x;
    canvas.lastY = y;
  };

  const handleMouseUp = () => setIsDrawing(false);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    socket.emit("chat", chatInput);
    setMessages((prev) => [...prev, `You: ${chatInput}`]);
    setChatInput("");
  };

  return (
    <div className="app">
      <h1>AI Whiteboard (Socket.IO)</h1>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: "1px solid #000", background: "#fff" }}
      />
      <div className="chat">
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </div>
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
