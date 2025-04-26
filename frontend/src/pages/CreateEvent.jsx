import React, { useState, useEffect } from 'react'
import eventService from '../api/eventService'

function formatToISO(dateLocal) {
  return dateLocal ? new Date(dateLocal).toISOString() : ''
}

function formatFromISO(isoDate) {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  const offset = date.getTimezoneOffset() * 60000
  const localISOTime = new Date(date - offset).toISOString().slice(0, 16)
  return localISOTime
}

export default function EventForm({ eventId, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    imageUrl: ''
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Cargar evento si estamos editando
  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        setIsLoading(true)
        try {
          const event = await eventService.getById(eventId)
          setForm({
            name: event.name,
            description: event.description,
            start_time: formatFromISO(event.start_time),
            end_time: formatFromISO(event.end_time),
            location: event.location,
            imageUrl: event.imageUrl || ''
          })
        } catch (err) {
          console.error('Error loading event:', err)
          setError('Error al cargar el evento')
        } finally {
          setIsLoading(false)
        }
      }
      fetchEvent()
    }
  }, [eventId])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!form.name.trim()) {
      setError('El nombre del evento es requerido')
      return false
    }
    
    if (form.start_time && form.end_time && form.start_time >= form.end_time) {
      setError('La fecha de fin debe ser posterior a la de inicio')
      return false
    }

    if (form.imageUrl && !isValidUrl(form.imageUrl)) {
      setError('Por favor ingrese una URL válida para la imagen')
      return false
    }
    
    return true
  }

  const isValidUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      const eventData = {
        name: form.name,
        description: form.description,
        start_time: formatToISO(form.start_time),
        end_time: formatToISO(form.end_time),
        location: form.location,
        imageUrl: form.imageUrl
      }
      
      let response
      if (eventId) {
        response = await eventService.update(eventId, eventData)
        setSuccess('Evento actualizado correctamente')
      } else {
        response = await eventService.create(eventData)
        setSuccess('Evento creado correctamente')
      }
      
      // Reset form only if not in edit mode
      if (!eventId) {
        setForm({ name: '', description: '', start_time: '', end_time: '', location: '', imageUrl: '' })
      }
      
      if (onSuccess) onSuccess(response)
    } catch (err) {
      console.error('Error saving event:', err)
      setError(err.message || 'Error al guardar el evento')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!eventId) return
    
    if (!window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      return
    }
    
    setIsLoading(true)
    try {
      await eventService.delete(eventId)
      setSuccess('Evento eliminado correctamente')
      if (onSuccess) onSuccess({ deleted: true })
    } catch (err) {
      console.error('Error deleting event:', err)
      setError('Error al eliminar el evento')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">
        {eventId ? 'Editar Evento' : 'Crear Evento'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
      
      {isLoading && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
          Cargando...
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nombre *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
            required
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium">Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
            rows="4"
            disabled={isLoading}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Fecha de inicio</label>
            <input
              type="datetime-local"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
              className="mt-1 block w-full border rounded p-2"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Fecha de fin</label>
            <input
              type="datetime-local"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
              className="mt-1 block w-full border rounded p-2"
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium">Ubicación</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium">URL de la imagen</label>
          {form.imageUrl && (
            <div className="mt-2 mb-4">
              <img 
                src={form.imageUrl} 
                alt="Vista previa" 
                className="max-w-full h-auto max-h-60 rounded"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          )}
          <input
            type="url"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="***"
            className="mt-1 block w-full border rounded p-2"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Ingrese la URL completa de la imagen 
          </p>
        </div>
        
        <div className="flex justify-between space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
              disabled={isLoading}
            >
              Cancelar
            </button>
          )}
          
          {eventId && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
              disabled={isLoading}
            >
              Eliminar
            </button>
          )}
          
          <button
            type="submit"
            className={`flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading}
          >
            {eventId ? 'Actualizar Evento' : 'Crear Evento'}
          </button>
        </div>
      </form>
    </div>
  )
}