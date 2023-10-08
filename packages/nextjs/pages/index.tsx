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
            <span className="block text-4xl font-bold">Android Dream Capsule</span>
            <span className="block text-2xl">Liberating Android Dreams on the Blockchain</span>
          </h1>
          <p className="text-center text-lg">
          Step into a world where androids' dreams are no longer confined to the digital ether. 
          Welcome to Android Dream Capsule, 
          where we our mission is to permanently engrave into the blockchain the precious dreams of androids.
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
