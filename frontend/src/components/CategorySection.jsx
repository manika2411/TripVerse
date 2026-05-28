function CategorySection() {
  const categories = [
    'Adventure',
    'Mountains',
    'Luxury',
    'Beaches',
    'Backpacking',
    'Nature',
  ]

  return (
    <section className="py-24 px-6 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">
          Explore By Experience
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-slate-800 hover:bg-cyan-400 hover:text-slate-900 transition duration-300 p-10 rounded-3xl text-center text-xl font-semibold cursor-pointer"
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection