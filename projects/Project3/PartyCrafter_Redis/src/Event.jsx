import React, { useEffect, useState } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { fetchEventDetails, fetchAddGuest, fetchAddTodo, fetchAddExpense } from "./services";
import { Button, ListGroup, ListGroupItem, Stack } from "react-bootstrap";

import Guest from "./Guest";
import TodoItem from "./TodoItem";
import Expense from "./Expense";

function Event({ eventState }) {

    const [ eventDetails, setEventDetails ] = useState([]);
    const [ guests, setGuests ] = useState([]);
    const [ todo, setTodo ] = useState([]);
    const [ expenses, setExpenses ] = useState([]);

    const [ newGuest, setNewGuest ] = useState({});
    const [ newTodo, setNewTodo ] = useState({});
    const [ newExpense, setNewExpense ] = useState({});

    function onFetchEventDetail(eventId) {
        fetchEventDetails(eventId).then( response => {
            setEventDetails(response);
            if("guests" in response) setGuests(response.guests);
            else setGuests([]);

            if("todo" in response) setTodo(response.todo);
            else setTodo([]);

            if("expenses" in response) setExpenses(response.expenses);
            else setExpenses([]);
        })
        .catch( error => {
            console.log(error);
        })
    }

    function onFetchAddGuest(eventId, guestDetails) {
        fetchAddGuest(eventId, guestDetails).then( response => {
            onFetchEventDetail(eventId);
        })
        .catch( error => {
            console.log(error);
        });
    }

    function onFetchAddTodo(eventId, todoDetails) {
        fetchAddTodo(eventId, todoDetails).then( response => {
            onFetchEventDetail(eventId);
        })
        .catch( error => {
            console.log(error);
        })
    }

    function onFetchAddExpense(eventId, expenseDetails) {
        fetchAddExpense(eventId, expenseDetails).then( response => {
            onFetchEventDetail(eventId);
        })
        .catch( error => {
            console.log(error);
        });
    }

    useEffect( () => {
        onFetchEventDetail(eventState);
    }, [eventState]);

    return (
        <div>
            <div className="detail-title">Event Detail</div>
            {eventDetails.length !== 0 &&
            <Stack gap={3} className="mb-4 col-lg-6 mx-auto">
                <Stack gap={5} direction="horizontal">
                    <div className="p-2">Name:</div>
                    <div className="p-2 ms-auto">{eventDetails.name}</div>
                </Stack>
                <Stack gap={5} direction="horizontal">
                    <div className="p-2">When:</div>
                    <div className="p-2 ms-auto">{eventDetails.date_time}</div>
                </Stack>
                <Stack gap={5} direction="horizontal">
                    <div className="p-2">Location:</div>
                    <div className="p-2 ms-auto">{eventDetails.location}</div>
                </Stack>
                <Stack gap={5} direction="horizontal">
                    <div className="p-2">Budget:</div>
                    <div className="p-2 ms-auto">{eventDetails.budget}</div>
                </Stack>
                <Stack gap={5} direction="horizontal">
                    <div className="p-2">Type:</div>
                    <div className="p-2 ms-auto">{eventDetails.type}</div>
                </Stack>
            </Stack>
            }
            

            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-2" justify>

                {/* Guest */}
                <Tab eventKey="guests" title="Guests">
                    <ListGroup variant="flush" className="event-info">
                        {guests.length !== 0 && guests.map( (guest, index) => (
                            <ListGroupItem key={index}>
                                <Guest guest={guest} onFetchEventDetail={onFetchEventDetail} eventId={eventState}/>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                    
                    {/* Adding a new guest */}
                    <Stack gap={3} className="add-stack">
                        <div className="mx-auto">Add a new Guest</div>
                        <div className="mx-auto"><input type="text" placeholder="Guest Name" value={newGuest.name || ''} onInput={(e) => setNewGuest({...newGuest, name: e.target.value})}/></div>
                        <div className="mx-auto"><input type="text" placeholder="Contact Info" value={newGuest.contact || ''} onInput={(e) => setNewGuest({...newGuest, contact: e.target.value})}/></div>
                        <div className="mx-auto"><input type="text" placeholder="RSVP Status" value={newGuest.RSVP_status || ''} onInput={(e) => setNewGuest({...newGuest, RSVP_status: e.target.value})}/></div>
                        <div className="mx-auto"><Button variant="success" onClick={() => {
                                onFetchAddGuest(eventState, newGuest);
                                setNewGuest({});
                            }}>Add</Button></div>
                    </Stack>
                </Tab>

                {/* To-do List */}
                <Tab eventKey="to-do-lists" title="To-do List">
                    <ListGroup variant="flush"  className="event-info">
                        {todo.length !== 0 && todo.map( (todoItem, index) => (
                            <ListGroupItem key={index}>
                                <TodoItem todoItem={todoItem} onFetchEventDetail={onFetchEventDetail} eventId={eventState}/>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                
                    {/* Adding a new to-do item */}
                    <Stack gap={3} className="add-stack">
                        <div className="mx-auto">Add a new To-do</div>
                        <div className="mx-auto"><input type="text" placeholder="To-do" value={newTodo.item_description || ''} onInput={(e) => setNewTodo({...newTodo, item_description: e.target.value})}/></div>
                        <div className="mx-auto"><input type="date" value={newTodo.deadline || ''} onInput={(e) => setNewTodo({...newTodo, deadline: e.target.value})}/></div>
                        <div className="mx-auto"><input type="number" placeholder="Priority Level" value={newTodo.priority_levels || ''} onInput={(e) => setNewTodo({...newTodo, priority_levels: e.target.value})}/></div>
                        <div className="mx-auto">
                            <Button variant="success" onClick={() => {
                                onFetchAddTodo(eventState, newTodo);
                                setNewTodo({});
                            }}>Add</Button>
                        </div>
                    </Stack>
                </Tab>

                {/* Expense */}
                <Tab eventKey="expenses" title="Expenses">
                    <ListGroup variant="flush"  className="event-info">
                        {expenses.length !== 0 && expenses.map( (expense, index) => (
                            <ListGroupItem key={index}>
                                <Expense expense={expense} onFetchEventDetail={onFetchEventDetail} eventId={eventState}/>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                    
                    {/* Adding a new expense record */}
                    <Stack gap={3} className="add-stack">
                        <div className="mx-auto">Add a new Expense</div>
                        <div className="mx-auto"><input type="text" placeholder="Description" value={newExpense.expense_description || ''} onInput={(e) => setNewExpense({...newExpense, expense_description: e.target.value})}/></div>
                        <div className="mx-auto"><input type="date" placeholder="Date Spent" value={newExpense.date_spent || ''} onInput={(e) => setNewExpense({...newExpense, date_spent: e.target.value})}/></div>
                        <div className="mx-auto"><input type="number" placeholder="$" value={newExpense.amount_spent || ''} onInput={(e) => setNewExpense({...newExpense, amount_spent: e.target.value})}/></div>
                        <div className="mx-auto">
                            <Button variant="success" onClick={() => {
                                onFetchAddExpense(eventState, newExpense);
                                setNewExpense({});
                            }}>Add</Button>
                        </div>
                    </Stack>
                </Tab>
            </Tabs>

            
        
        </div>
    )
}

export default Event;