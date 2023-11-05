import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";

import { fetchEventData } from "./services";
import { DETAIL_PAGE } from "./constants";

import Event from "./Event";
import NewEvent from "./NewEvent";

function Main({ onLogout, userId, username }) {
    // 'events' stores a list of events associated with current userId
    const [ events, setEvents ] = useState([]);

    const [ detailPage, setDetailPage ] = useState(DETAIL_PAGE.NO_CONTENT);
    const [ eventState, setEventState ] = useState();

    function onFetchEventData(userId) {
        fetchEventData(userId).then( response => {
            setEvents(response);
        })
        .catch( error => {
            console.log(error.error);
        })
    }

    useEffect( () => {
        onFetchEventData(userId);
    }, []);

    return (
        <div className="main-container">

            <div>
                <div>Welcome, {username}</div>
                <Button variant="btn btn-outline-danger" onClick={() => {onLogout();}}>Logout</Button>
            </div>

            <div className="main">

                <Button className="new-event-button" 
                onClick={() => {setDetailPage(DETAIL_PAGE.ADD_NEW_EVENT)}}>Add New Event</Button>

                <div className="events">
                    {events.length !== 0 && events.map( (event, index) => (
                        <Card key={event.event_id}>
                            <Card.Title>Event #{index + 1}</Card.Title>
                            <Card.Body>
                                <div>{event.name}</div>
                                <div>When: {event.date_time}</div>
                            </Card.Body>
                            <Button onClick={() => {
                                setEventState(event.event_id);
                                setDetailPage(DETAIL_PAGE.EVENT_DETAIL);
                            }}>Edit</Button>
                        </Card>
                    ))}
                </div>

                <div className="event-detail">
                    { detailPage === DETAIL_PAGE.EVENT_DETAIL && <Event eventState={eventState}/>}
                    { detailPage === DETAIL_PAGE.ADD_NEW_EVENT && <NewEvent onFetchEventData={onFetchEventData} userId={userId}/>}
                </div>

            </div>
            
        </div>
    )
}

export default Main;