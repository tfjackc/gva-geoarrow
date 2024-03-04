"use client";
import GeoArrow from "@/app/ui/flamingarrows";
import AppBar from "@/app/ui/appbar";
export default function Home() {

  return (
      <main className="flex min-h-screen">
          <div className="flex flex-grow font-mono">
              <div className="flex flex-col w-full">
                  <AppBar />
                  <GeoArrow />
              </div>
          </div>
      </main>
  );
}
