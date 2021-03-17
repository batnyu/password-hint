import { assign, Machine } from "xstate";

const incrementValidCounter = assign({
  validCounter: (context, event) => context.validCounter + 1,
});

const resetCounter = assign({
  validCounter: 0,
});

const generateId = (key, index) => `${key}#${index}`;

const createOnEventPress = ({ key, index }) => ({
  on: {
    PRESS: [
      {
        target: generateId(key, index),
        cond: (context, event) => event.key === key,
      },
      { target: "invalid" },
    ],
  },
});

export const createPasswordMachine = (code, onSuccess) => {
  const codeWithIndexes = code.map((key, index) => ({
    index,
    key,
  }));

  const states = codeWithIndexes
    .map(({ index, key }, i, array) => {
      if (i === array.length - 1) {
        return {
          [generateId(key, index)]: {
            entry: "incrementValidCounter",
            always: "success",
          },
        };
      } else {
        return {
          [generateId(key, index)]: {
            entry: "incrementValidCounter",
            ...createOnEventPress(array[i + 1]),
            after: {
              3000: "idle",
            },
          },
        };
      }
    })
    .reduce((acc, cur) => {
      return {
        ...acc,
        ...cur,
      };
    }, {});

  return Machine(
    {
      id: "password",
      initial: "idle",
      context: {
        validCounter: 0,
      },
      states: {
        idle: {
          entry: "resetCounter",
          ...createOnEventPress(codeWithIndexes[0]),
        },
        ...states,
        success: { type: "final", entry: "onSuccess" },
        invalid: {
          after: {
            750: "idle",
          },
        },
      },
    },
    {
      actions: {
        incrementValidCounter,
        resetCounter,
        onSuccess,
      },
    }
  );
};
