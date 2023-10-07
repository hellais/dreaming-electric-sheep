import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { FractalInferno, PRNGFactory } from "~~/components/fractal/flame";
import React, { useEffect } from "react";
import NoSSR from 'react-no-ssr';

let fractalJSONA = [
  "custom",
  {
    weight: 0.046875,
    col: [0.19, 0.28, 0.05],
    c: [0.843, -0.826, -1.247, 0.419, 0.023, -0.395],
    v: ["Disc", "Polar", "Hyperbolic"],
    w: [0.6, 0.25, 0.15],
  },
  {
    weight: 0.0078125,
    col: [0.53, 0.15, 0.07],
    c: [-0.338, -1.444, -1.22, -0.127, 1.048, 0.998],
    v: ["Polar", "Disc", "Spherical"],
    w: [0.4, 0.25, 0.35],
  },
  {
    weight: 0.5,
    col: [0.76, 0.74, 0.6],
    c: [-1.047, 0.431, 1.32, -0.238, 0.792, -0.207],
    v: ["Disc"],
    w: [1],
  },
  {
    weight: 0.3125,
    col: [0.62, 0.39, 0.35],
    c: [-0.075, -1.359, 0.188, -0.209, -1.335, -0.26],
    v: ["Spherical", "Polar", "Disc"],
    w: [0.5, 0.2, 0.3],
  },
  {
    weight: 0.125,
    col: [0.73, 0.51, 0.8],
    c: [-1.471, 0.723, 0.26, -0.049, -0.561, 1.482],
    v: ["Disc", "Spherical", "Hyperbolic"],
    w: [0.25, 0.2, 0.55],
  },
];
let fractalJSON = [
  "custom",
  {
    weight: 0.3,
    col: [0.19, 0.28, 0.05],
    c: [0.843, -0.826, -1.247, 0.419, 0.023, -0.395],
    v: ["Sinusoidal", "Polar"],
    w: [0.8, 0.2],
  },
  {
    weight: 0.3,
    col: [0.73, 0.51, 0.8],
    c: [-1.471, 0.723, 0.26, -0.049, -0.561, 1.482],
    v: ["Spherical", "Spiral"],
    w: [0.3, 0.7],
  },
  {
    weight: 0.2,
    col: [0.73, 0.51, 0.8],
    c: [-1.471, 0.723, 0.26, -0.049, -0.561, 1.482],
    v: ["Power", "Spiral"],
    w: [0.7, 0.3],
  },
  {
    weight: 0.2,
    col: [0.62, 0.39, 0.35],
    c: [-0.075, -1.359, 0.188, -0.209, -1.335, -0.26],
    v: ["Spherical", "Polar"],
    w: [0.3, 0.7],
  },
];

const DreamRender = () => {
  //setCustomFuncs(fractalinferno.getFuncs());
  useEffect(() => {
    var fractalinferno = FractalInferno();
    fractalinferno.setFuncs(fractalJSON);
    fractalinferno.setParams({
      final: -1,
      cfinal: -1,
      canvasW: 800,
      canvasH: 800,
      zoom: 1,
      rot: 1,
      mirrorX: false,
      mirrorY: false,
    });
    fractalinferno.begin();
  }, []);

  const renderingbarStyle = {
    position: "fixed",
    top: "32px",
    left: "0",
    width: "300px",
    fontFamily: "monospace",
    textAlign: "center",
  };

  return (<div
  style={{ backgroundColor: "#000", width: "800px", height: "800px" }}
>
  <canvas id="canvas" style={{ position: "absolute" }}></canvas>
  <div id="renderingbar" style={renderingbarStyle}></div>
  </div>
  )
}

const DreamViewer: NextPage = () => {
  /*
  const PRNG = PRNGFactory("antani");
  [1, 2, 3, 4].forEach(() => {
    console.log(PRNG());
  });
  */

  return (
    <>
      <MetaHeader
        title="Example UI | Scaffold-ETH 2"
        description="Example UI created with 🏗 Scaffold-ETH 2, showcasing some of its features."
      >
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="grid lg:grid-cols-2 flex-grow" data-theme="exampleUi">
      <NoSSR>
        <DreamRender />
      </NoSSR>
      </div>
    </>
  );
};

export default DreamViewer;