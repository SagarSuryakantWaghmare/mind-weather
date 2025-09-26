import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <>
      <div className="w-screen h-screen bg-black text-white">
        <div className="max-w-[1200px] mx-auto h-full px-6 flex flex-col">

          <main className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-[600px] mx-auto text-center">
              <h1 className="text-6xl mb-4">Mind Weather app, period.</h1>
              <p className="text-white/60 text-2xl mb-4">This is the best app for tracking your mood throughout your life. All you have to do is be honest.</p>
              <div>
                <Link href="/journal">
                  <button className="bg-blue-600 px-4 py-2 rounded-lg text-xl">Get Started</button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
