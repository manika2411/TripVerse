const express = require('express')
const cors = require('cors')
require('dotenv').config()

const connectDB = require('./config/db')

connectDB()
const app = express()

app.use(cors())
app.use(express.json())
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const tripRoutes = require('./routes/tripRoutes')

app.use('/api/users', userRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/trips', tripRoutes)

app.get('/', (req, res) => {
  res.send('Tripverse API Running')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})