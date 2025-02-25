import { Link } from "react-router-dom"

function Home() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl font-bold mb-6">Current Temperature Reports at UNCC</h2>
      <p className="text-gray-600 mb-4">
        View and submit temperature reports for different locations across the UNC campus.
      </p>
      <Link
        to="/report"
        className="inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        Submit New Report
      </Link>
    </div>
  )
}

export default Home

