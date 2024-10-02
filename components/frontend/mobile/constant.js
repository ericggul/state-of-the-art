export const DUMMY_CONVERSATION = [
  {
    ai: "Good afternoon. You’ve just stepped into a world where technology and artistry converge. May I ask your name?",
    customer_input: {
      type: "input",
      placeholder: "Name Input",
    },
  },
  {
    ai: "Ah, {{customer_name}}, it’s a pleasure to have you. What you’re about to experience is an exclusive showcase of neural networks, each one a masterpiece of innovation. Shall we begin?",
    customer_choices: [
      {
        label: "Absolutely, let’s get started.",
        value: "let's_get_started",
      },
      {
        label: "I’m eager to explore.",
        value: "eager_to_explore",
      },
    ],
  },
  {
    ai: "Let’s start with **LeNet v1.0**, the pioneering model of convolutional neural networks. Imagine this as the initial sketch of a grand masterpiece – fundamental, yet incredibly forward-thinking. It was designed to recognise images, transforming pixel data into structured understanding. Fascinating, don’t you think?",
    customer_choices: [
      {
        label: "Absolutely, it’s impressive.",
        value: "impressive",
      },
      {
        label: "Quite extraordinary.",
        value: "extraordinary",
      },
    ],
  },
  {
    ai: "Now, before we continue, I invite you to experience the model interactively. Enable your accelerometer to rotate the 3D model of **LeNet v1.0** in real-time – a chance to explore this technological artwork from every angle.",
    customer_choices: [
      {
        label: "Enable accelerometer.",
        value: "enable_accelerometer",
      },
      {
        label: "Not now, continue.",
        value: "continue_without_accelerometer",
      },
    ],
  },
];
