import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import React from "react";


const DreamExamples: NextPage = () => {
  return (
    <>
      <MetaHeader
        title="Dreaming of Electric Sheep"
        description="Example UI created with 🏗 Scaffold-ETH 2, showcasing some of its features."
      >
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="grid lg:grid-cols-2 flex-grow">
        <img src="/dreams/11.jpg"/>
        <img src="/dreams/22.jpg"/>
        <img src="/dreams/33.jpg"/>
      </div>
    </>
  );
};

export default DreamExamples;