import "./App.css";

export function EventList({ events }) {
  return (
    <div className="event-grid">
      {events.map(event => (
        <div key={event._id} className="event-card" style={{ backgroundColor: event.color }}>
          <h3>{event.title}</h3>
          <p>{event.date}</p>
        </div>
      ))}
    </div>
    
  );
}