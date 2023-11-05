import React, { useEffect, useState } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { fetchEventDetails, fetchEventGuests, fetchEventTodo, fetchEventExpenses } from "./services";
import { Button, Container, ListGroup, ListGroupItem } from "react-bootstrap";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Event({ eventState }) {

    const [ eventDetails, setEventDetails ] = useState([]);
    const [ guests, setGuests ] = useState([]);
    const [ todo, setTodo ] = useState([]);
    const [ expenses, setExpenses ] = useState([]);

    function onFetchEventDetail(eventId) {
        fetchEventDetails(eventId).then( response => {
            setEventDetails(response);
        })
        .catch( error => {
            console.log(error);
        })
    }

    function onFetchEventGuests(eventId) {
        fetchEventGuests(eventId).then( response => {
            setGuests(response);
        })
        .catch( error => {
            console.log(error);
        })
    }

    function onFetchEventTodo(eventId) {
        fetchEventTodo(eventId).then( response => {
            setTodo(response);
        })
        .catch( error => {
            console.log(error);
        })
    }

    function onFetchEventExpenses(eventId) {
        fetchEventExpenses(eventId).then( response => {
            setExpenses(response);
        })
        .catch( error => {
            console.log(error);
        })
    }

    useEffect( () => {
        onFetchEventDetail(eventState);
        onFetchEventGuests(eventState);
        onFetchEventTodo(eventState);
        onFetchEventExpenses(eventState);
    }, [eventState]);

    return (
        <div>
            Event #{eventState} Details
            <div>
                {eventDetails.length !== 0 &&
                <div>
                    {eventDetails[0].name}
                    {eventDetails[0].date_time}
                    {eventDetails[0].location}
                    {eventDetails[0].budget}
                    {eventDetails[0].type}
                </div>}
            </div>

            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">

                <Tab eventKey="guests" title="Guests">
                    <ListGroup variant="flush">
                        {guests.length !== 0 && guests.map( (guest, index) => (
                            <ListGroupItem key={index}>
                                <Container>
                                    <Row>
                                        <Col sm={true}>{guest.name}</Col>
                                        <Col md={true}>{guest.contact}</Col>
                                        <Col sm={true}>{guest.RSVP_status}</Col>
                                    </Row>
                                </Container>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                
                    <div>
                        <Button>Add a New Guest</Button>
                    </div>
                </Tab>

                <Tab eventKey="to-do-lists" title="To-do List">
                    <ListGroup variant="flush">
                        {todo.length !== 0 && todo.map( (todoItem, index) => (
                            <ListGroupItem key={index}>
                                <Container>
                                    <Row>
                                        <Col md={true}>{todoItem.item_description}</Col>
                                        <Col lg={true}>{todoItem.deadline}</Col>
                                        <Col sm={true}>{todoItem.priority_levels}</Col>
                                    </Row>
                                </Container>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                
                    <div>
                        <Button>Add a New To-do</Button>
                    </div>
                </Tab>

                <Tab eventKey="expenses" title="Expenses">
                    <ListGroup variant="flush">
                        {expenses.length !== 0 && expenses.map( (expense, index) => (
                            <ListGroupItem key={index}>
                                <Container>
                                    <Row>
                                        <Col md={true}>{expense.expense_description}</Col>
                                        <Col lg={true}>{expense.date_spent}</Col>
                                        <Col sm={true}>${expense.amount_spent}</Col>
                                    </Row>
                                </Container>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                
                    <div>
                        <Button>Add a New Expense</Button>
                    </div>
                </Tab>
            </Tabs>

            
        
        </div>
    )
}

export default Event;