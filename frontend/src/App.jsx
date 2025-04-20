import React, { useEffect, useState } from 'react'
import eventService from './api/eventService'

function App() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Obtener eventos desde la API
    eventService.list()
      .then(data => {
        setEvents(data)
        setLoading(false)
      })
      .catch(err => {
        setError('Error al cargar eventos')
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="text-center mt-10">Cargando eventos...</div>
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Lista de Eventos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
            <p className="text-gray-600 mb-4">
              {event.description || 'Sin descripción'}
            </p>
            <p className="text-gray-500 text-sm">
              {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}
            </p>
            {event.location && (
              <p className="text-gray-500 text-sm mt-1">Ubicación: {event.location}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App