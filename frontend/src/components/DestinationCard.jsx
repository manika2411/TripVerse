import { Link } from 'react-router-dom'

function DestinationCard({ destination }) {
  return (
    <Link
      to={`/destination/${destination.id}`}
      className="group rounded-3xl overflow-hidden relative h-[420px]"
    >
      <img
        src={destination.image}
        alt={destination.name}
        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

      <div className="absolute bottom-0 p-6">
        <h3 className="text-3xl font-bold mb-2">{destination.name}</h3>
        <p className="text-slate-300">{destination.country}</p>
      </div>
    </Link>
  )
}

export default DestinationCard