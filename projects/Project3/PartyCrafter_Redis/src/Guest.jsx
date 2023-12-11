import React, { useState } from "react";
import { Container, Row, Col, DropdownButton, DropdownItem, Button } from "react-bootstrap";

import { fetchDeleteGuest, fetchUpdateGuest } from "./services";

function Guest ({ guest, onFetchEventDetail, eventId }) {

    const [ edit, setEdit ] = useState(false);
    const [ guestDetail, setGuestDetail ] = useState(guest);

    function onFetchUpdateGuest(guestId, eventId, guestDetail) {
        fetchUpdateGuest(guestId, guestDetail).then(() => {
            onFetchEventDetail(eventId);
        })
        .catch( error => {
            console.log(error.error);
        });
    }

    function onFetchDeleteGuest(guestId) {
        fetchDeleteGuest(guestId).then(() => {
            onFetchEventDetail(eventId);
        })
        .catch( error => {
            console.log(error.error);
        });
    }

    return (
        <Container>
            <Row>
                <Col md={10}>
                    {edit && <Container>
                        <Row>
                            <Col md={4}><input type="text" value={guestDetail.name} onInput={(e) => setGuestDetail({...guestDetail, name: e.target.value})}/></Col>
                            <Col md={5}><input type="text" value={guestDetail.contact} onInput={(e) => setGuestDetail({...guestDetail, contact: e.target.value})}/></Col>
                            <Col md={3}><input type="text" value={guestDetail.RSVP_status}  onInput={(e) => setGuestDetail({...guestDetail, RSVP_status: e.target.value})}/></Col>
                        </Row>
                    </Container>}
                    {!edit && 
                    <Container>
                        <Row>
                            <Col md={4}>{guest.name}</Col>
                            <Col md={5}>{guest.contact}</Col>
                            <Col md={3}>{guest.RSVP_status}</Col> 
                        </Row>
                    </Container>}
                    
                </Col>
                <Col md={2}>
                    {edit && <Button onClick={() => {setEdit(false); onFetchUpdateGuest(guest.guest_id, eventId, guestDetail)}}>Update</Button>}
                    {!edit && 
                    <DropdownButton title="Modify" variant="success">
                        <DropdownItem onClick={() => {setEdit(true)}}>Edit</DropdownItem>
                        <DropdownItem onClick={() => {onFetchDeleteGuest(guest.guest_id)}}>Delete</DropdownItem>
                    </DropdownButton>
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default Guest;
