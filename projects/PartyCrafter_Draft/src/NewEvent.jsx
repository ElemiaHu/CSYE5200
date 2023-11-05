import React, { useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";

import { fetchAddEvent } from "./services";

function NewEvent({ onFetchEventData, userId }) {
    const [ eventData, setEventData ] = useState({ type: 'self-owned' });

    function onAddNewEvent(eventDetails, userId) {
        fetchAddEvent(eventDetails, userId).then( response => {
            console.log(response);
            onFetchEventData(userId);
        })
        .catch( error => {
            console.log(error.error);
        })
    }

    return (
        <Container>
            <Row>
                <Col lg={4}>
                    <Container>
                        <Row>Name</Row>
                        <Row>
                            <input type="text" value={eventData?.name || ''} required onInput={(e) => setEventData({...eventData, name: e.target.value})}/>
                        </Row>
                    </Container>
                </Col>

                <Col lg={4}>
                    <Container>
                        <Row>Date</Row>
                        <Row>
                            <input type="datetime-local" value={eventData?.date_time || ''} required onInput={(e) => setEventData({...eventData, date_time: e.target.value})}/>
                        </Row>
                    </Container>
                </Col>
            </Row>

            <Row>
                <Col lg={4}>
                    <Container>
                        <Row>Location</Row>
                        <Row>
                            <input type="text" value={eventData?.location || ''} required onInput={(e) => setEventData({...eventData, location: e.target.value})}/>
                        </Row>
                    </Container>
                </Col>
                <Col lg={4}>
                    <Container>
                        <Row>Budget</Row>
                        <Row>
                            <input type="number" value={eventData?.budget || ''} required onInput={(e) => setEventData({...eventData, budget: e.target.value})}/>
                        </Row>
                    </Container>
                </Col>
            </Row>

            <Row>
                <Col lg={8}>
                    <Container>
                        <Row>Description</Row>
                        <Row>
                            <textarea value={eventData?.description || ''} required onInput={(e) => setEventData({...eventData, description: e.target.value})}/>
                        </Row>
                    </Container>
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <div className="mb-2 mt-2">
                        <select name="eventType" onChange={(e) => setEventData({...eventData, type: e.target.value})}>
                            <option value="Self-Owned">Self-Owned</option>
                            <option value="Cohosted">Cohosted</option>
                        </select>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button onClick={() => {
                        onAddNewEvent(eventData, userId);
                        setEventData({ type: 'self-owned' });
                    }}>Add</Button>
                </Col>
            </Row>
            
        </Container>
    )
}

export default NewEvent;