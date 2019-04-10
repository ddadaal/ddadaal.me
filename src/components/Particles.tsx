import React from "react";
// import ParticlesOriginal from "react-particles-js";

interface Props {
  width?: number;
  height?: number;
  marginTop?: number;
}

const params = {
  particles: {
    number: {
      value: 50,
    },
    size: {
      value: 3,
    },
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "repulse",
      },
      onclick: {
        enable: true,
        mode: "push",
      },
      resize: true,
    },
  },
};

export default class Particles extends React.PureComponent<Props, {}> {
  render() {
    const { width, marginTop, height } = this.props;
    // return <ParticlesOriginal height={`${height}px`} params={params} />;
    return null;
  }
}
