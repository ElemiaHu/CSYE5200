import React, { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col, Stack } from "react-bootstrap";

import { fetchEventData } from "./services";
import { DETAIL_PAGE } from "./constants";

import Event from "./Event";
import NewEvent from "./NewEvent";
import MyDate from "./date";

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
    }, [userId]);

    return (
        <div className="main-container">

            <Stack direction="horizontal" gap={3} className="user-info" lg={true}>
                <div className="p-2 title">Party Crafter</div>
                <div className="p-2 ms-auto">{username}</div>
                <div className="p-2"><Button variant="danger" onClick={() => {onLogout();}}>Logout</Button></div>
            </Stack>

            <Container className="main">
                <Row>
                    <Col lg={3}>
                        <Container className="left-container">
                            <div className="add-event">
                                <Button className="new-event-button"
                                onClick={() => {setDetailPage(DETAIL_PAGE.ADD_NEW_EVENT)}}>Add New Event</Button>
                            </div>
                            
                            <div className="events">
                                {events.length !== 0 && events.map( (event, index) => {
                                    const formattedDate = new MyDate(event.date_time);
                                    return (
                                        <Card key={event.event_id} className="mt-2 event-card">
                                            <Card.Body>
                                                <Card.Title>Event #{index + 1}</Card.Title>
                                                <div>{event.name}</div>
                                                <div>When: {`${formattedDate.getYear()}-${formattedDate.getMonth()}-${formattedDate.getDay()}`}</div>
                                            </Card.Body>
                                            <Button onClick={() => {
                                                setEventState(event.event_id);
                                                setDetailPage(DETAIL_PAGE.EVENT_DETAIL);
                                            }}>Details</Button>
                                        </Card>
                                    )
                                })}
                            </div>
                        </Container>
                    </Col>
                    <Col lg={9}>
                        <div>
                            { detailPage === DETAIL_PAGE.EVENT_DETAIL && <Event eventState={eventState}/>}
                            { detailPage === DETAIL_PAGE.ADD_NEW_EVENT && <NewEvent onFetchEventData={onFetchEventData} userId={userId}/>}
                        </div>
                    </Col>
                </Row>
                

                
            </Container>

        </div>
    )
}

export default Main;