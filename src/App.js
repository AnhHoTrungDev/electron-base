import React from "react";
import "./App.css";
import { print } from "./print";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <button
          onClick={() => {
            print();
          }}
        >
          print
        </button>
      </header>
    </div>
  );
}

export default App;
