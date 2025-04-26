export const editarEstacion = (id, data) =>
    fetch(`${API_URL}/estaciones/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  
  export const eliminarEstacion = (id) =>
    fetch(`${API_URL}/estaciones/${id}`, {
      method: "DELETE",
    });