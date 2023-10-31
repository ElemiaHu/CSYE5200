import { useState } from 'react';
import './App.css';
import { fetchEventData,fetchAddEvent,fetchUpdateEventBudget, fetchDeleteEvent } from './services';

function App() {
  const [ username, setUsername ] = useState('test');
  const [ eventData, setEventData ] = useState();
  const [ editBudget, setEditBudget ] = useState(false);
  const [ newBudget, setNewBudget ] = useState();
  const [ newEvent, setNewEvent ] = useState({type: 'self-owned'});

  function onEnterUsername(username) {
    fetchEventData(username)
    .then(response => {
      setEventData(response)
    });
  }

  function onAddNewEvent(eventDetails, username) {
    fetchAddEvent(eventDetails, username).then(response => {
      onEnterUsername(username);
    })
  }

  function onUpdateBudget(eventId, budget) {
    fetchUpdateEventBudget(eventId, budget).then(response => {
      onEnterUsername(username);
      setEditBudget(false);
    })
  }

  function onDeleteEvent(eventId) {
    fetchDeleteEvent(eventId).then(response => {
      onEnterUsername(username);
    })
  }

  return (
    <div className="App">
      <div className='title'>Party Crafter</div>

      <div className='search-username-container'>
        <input type='text' onInput={(e) => setUsername(e.target.value)}/>
        <button onClick={() => {onEnterUsername(username)}}>Search</button>
      </div>

      <div>Hi, {username}</div>

      <div>{eventData && eventData.map(eventItem => 
        <div key={eventItem.event_id} className='event-info-container'>
          <div>{eventItem.event_id}</div>
          <div>{eventItem.name}</div>
          <div>{eventItem.location}</div>
          <div>
            {!editBudget && eventItem.budget}
            { editBudget &&
              <div>
                <input type='number' required onInput={(e) => setNewBudget(e.target.value)}/>
                <button onClick={() => onUpdateBudget(eventItem.event_id, newBudget)}>Update</button>
              </div>}
            <button onClick={() => setEditBudget(editBudget ? false : true)}>
              {editBudget && 'Cancel'}
              {!editBudget && 'Edit'}
            </button>
          </div>
          <div>{eventItem.type}</div>
          <button onClick={() => onDeleteEvent(eventItem.event_id)}>Delete</button>
        </div>
      )}</div>

      <div className='add-event-container'>
        <div>Add an Event Here</div>
          <div>
              <input type='text' placeholder='Name' value={newEvent?.name || ''} required onInput={(e) => setNewEvent({...newEvent, name: e.target.value})}/>
              <input type='text' placeholder='Description' value={newEvent?.description || ''} required onInput={(e) => setNewEvent({...newEvent, description: e.target.value})}/>
              <input type='datetime-local' required value={newEvent?.date_time || ''} onInput={(e) => setNewEvent({...newEvent, date_time: e.target.value})}/>
              <input type='text' placeholder='Location' required value={newEvent?.location || ''} onInput={(e) => setNewEvent({...newEvent, location: e.target.value})}/>
              <input type='number' placeholder='Budget' required value={newEvent?.budget || 0} onInput={(e) => setNewEvent({...newEvent, budget: parseInt(e.target.value)})}/>
              <select name="eventType" onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}>
                  <option value="Self-Owned">Self-Owned</option>
                  <option value="Cohosted">Cohosted</option>
              </select>
              <button onClick={() => {
                onAddNewEvent(newEvent, username);
                setNewEvent({type: 'self-owned'});
              }}>Add</button>
          </div>
      </div>

      <div></div>
    </div>
  );
}

export default App;
