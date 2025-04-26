import "/App.css";
<input
  type="text"
  name="imagen"
  value={form.imagen || ""}
  onChange={handleChange}
  placeholder="URL de la imagen"
  className="form-input"
/>