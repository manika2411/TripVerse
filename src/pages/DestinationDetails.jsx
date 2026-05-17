import { useParams } from 'react-router-dom'

function DestinationDetails() {
  const { id } = useParams()

  return (
    <div className="pt-32 px-6 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold mb-6">
        Destination Details #{id}
      </h1>

      <p className="text-slate-400 text-lg">
        Full destination details page will be built here.
      </p>
    </div>
  )
}

export default DestinationDetails