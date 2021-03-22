import "./App.css";

import { inspect } from "@xstate/inspect";
import { useMachine } from "@xstate/react";
import { useEffect } from "react";
import { createPasswordMachine } from "./passwordMachine";
import classNames from "classnames";
import React from 'react'

inspect({
  // options
  // url: 'https://statecharts.io/inspect', // (default)
  iframe: false, // open in new window
});

function App() {
  // const code = ["t", "i", "s", "b", "a"];
  // konami code
  const code = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  const passwordMachine = createPasswordMachine(() => {
    console.log("System unlocked");
  });
  const [current, send] = useMachine(passwordMachine, { devTools: true, context: {
    code
  } });
  useKeyPress(send);

  const createClassName = (index) =>
    classNames("rounded-full h-12 w-12 mx-2 bg-gray-300", {
      "bg-lime-600": current.context.validCounter > index,
      "bg-red-600":
        current.context.validCounter === index && current.matches("invalid"),
    });

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="w-full flex flex-row justify-center">
        {current.context.code.map((key, index) => (
          <div key={index} className={createClassName(index)}></div>
        ))}
      </div>
      {current.matches("success") ? (
        <div className="p-4">System unlocked!</div>
      ) : null}
    </div>
  );
}

function useKeyPress(send) {
  function downHandler({ key }) {
    send({ type: "PRESS", key });
  }

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  });
}

export default App;
