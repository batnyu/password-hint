import { assign, Machine } from "xstate";

const incrementValidCounter = assign({
  validCounter: (context, event) => context.validCounter + 1,
});

const resetCounter = assign({
  validCounter: (context, event) => 0,
});

const isKeyOk = (context, event) =>
  event.key === context.code[context.validCounter];

const isCodeOk = (context, event) =>
  context.validCounter === context.code.length;

export const createPasswordMachine = (onSuccess) => {
  return Machine(
    {
      id: "password",
      initial: "idle",
      context: {
        code: ["t", "i", "s", "b", "a"],
        validCounter: 0,
      },
      states: {
        idle: {
          on: {
            PRESS: [
              {
                target: "idle",
                actions: "incrementValidCounter",
                cond: "isKeyOk",
              },
              { target: "invalid" },
            ],
          },
          always: [{ target: "success", cond: "isCodeOk" }],
          after: {
            3000: {
              target: "idle",
              actions: "resetCounter",
            },
          },
        },
        success: { type: "final", entry: "onSuccess" },
        invalid: {
          after: {
            750: {
              target: "idle",
              actions: "resetCounter",
            },
          },
        },
      },
    },
    {
      actions: {
        incrementValidCounter,
        onSuccess,
        resetCounter,
      },
      guards: {
        isKeyOk,
        isCodeOk,
      },
    }
  );
};
