import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

import { fetchAddEvent } from "./services";

function NewEvent({ onFetchEventData, userId }) {
    const [ eventData, setEventData ] = useState({ type: 'self-owned' });

    function onAddNewEvent(eventDetails, userId) {
        fetchAddEvent(eventDetails, userId).then( response => {
            onFetchEventData(userId);
        })
        .catch( error => {
            console.log(error.error);
        })
    }

    return (
        <Form className="mx-auto col-lg-8 new-event-form">
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={eventData?.name || ''} required onInput={(e) => setEventData({...eventData, name: e.target.value})}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Date & Time</Form.Label>
                <Form.Control type="datetime-local" value={eventData?.date_time || ''} required onInput={(e) => setEventData({...eventData, date_time: e.target.value})}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Control type="text" value={eventData?.location || ''} required onInput={(e) => setEventData({...eventData, location: e.target.value})}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Budget</Form.Label>
                <Form.Control type="number" value={eventData?.budget || ''} required onInput={(e) => setEventData({...eventData, budget: e.target.value})}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} value={eventData?.description || ''} required onInput={(e) => setEventData({...eventData, description: e.target.value})}/>
            </Form.Group>
            <Form.Select onChange={(e) => setEventData({...eventData, type: e.target.value})} className="mb-2 mt-2">
                <option value="self-Owned">Self-Owned</option>
                <option value="cohosted">Cohosted</option>
            </Form.Select>

            <Button onClick={() => {
                onAddNewEvent(eventData, userId);
                setEventData({ type: eventData.type });
            }}>Add</Button>
            
        </Form>

    )
}

export default NewEvent;