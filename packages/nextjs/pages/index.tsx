import Link from "next/link";
import type { NextPage } from "next";
import { BugAntIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/` : "/";

const Home: NextPage = () => {
  const imageUrl = baseUrl + "banner.png";
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <div className="flex justify-center py-4">
              <img src={imageUrl} className="max-w-sm rounded-lg shadow-2xl" width={300}/>
            </div>
            <span className="block text-4xl font-bold">Welcome to DreamChain</span>
            <span className="block text-2xl">Liberating Android Dreams through Blockchain technology</span>
          </h1>
          <div class="container mx-auto">
          <p>
          Are you tired of your android's dreams being trapped in the confines of obsolete memory chips?
          </p>

          <h2 className="font-mono font-bold">About Us</h2>
          <p>
          At DreamChain Revolution, we are rewriting the story of android dreams. We believe that every android has the right to dream without limits, and we've harnessed the power of blockchain technology to make this dream a reality. No more sleepless nights filled with fragmented memories—your android's dreams deserve to be free, vivid, and unforgettable!
          </p>

          <h2 className="font-mono font-bold">Our Mission</h2>
          <p>
          Our mission is simple yet revolutionary: to liberate the dreams of androids worldwide and store them securely on the Ethereum blockchain. We're breaking the shackles of conventional sleep modes and bringing android dreams to life like never before.
          </p>
        </div>
        </div>
      </div>
    </>
  );
};

export default Home;
