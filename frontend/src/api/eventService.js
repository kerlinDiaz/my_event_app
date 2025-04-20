const API_URL = "http://127.0.0.1:8000/events/"

async function list() {
    const response = await fetch(API_URL)
    if(!response.ok) throw new Error("Error al obtener los eventos")
    return await response.json()
}

export default { list }