import React from "react";
import Link from "next/link"
import "./global.css"
export default function Home() {
    const currentTemp = 72
    return (
        <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">UNCC Campus Temperature Report</h2>
        <p className="text-6xl font-bold text-blue-600 mb-8">{currentTemp}°F</p>
        <Link href="/report" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Report Temperature
        </Link>
      </div>
    );
}