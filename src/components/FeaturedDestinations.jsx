import DestinationCard from './DestinationCard'

const destinations = [
  {
    id: 1,
    name: 'Bali',
    country: 'Indonesia',
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200',
  },
  {
    id: 2,
    name: 'Paris',
    country: 'France',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200',
  },
  {
    id: 3,
    name: 'Tokyo',
    country: 'Japan',
    image:
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200',
  },
]

function FeaturedDestinations() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="mb-14">
        <p className="text-cyan-400 uppercase tracking-[4px] mb-4">
          Featured Destinations
        </p>

        <h2 className="text-4xl md:text-5xl font-bold">
          Discover Your Next Adventure
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
          />
        ))}
      </div>
    </section>
  )
}

export default FeaturedDestinations