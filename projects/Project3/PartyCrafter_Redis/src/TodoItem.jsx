import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import MyDate from "./date";
import { fetchDeleteTodo, fetchMarkDone } from "./services";

function TodoItem({ todoItem, onFetchEventDetail, eventId }) {
    const formattedDate = new MyDate(todoItem.deadline);

    function onFetchDeleteTodo(itemId) {
        fetchDeleteTodo(itemId).then( response => {
            onFetchEventDetail(eventId);
        })
        .catch( error => {
            console.log(error.error);
        });
    }

    function onFetchMarkDone(itemId) {
        fetchMarkDone(itemId).then( response => {
            onFetchEventDetail(eventId);
        })
        .catch( error => {
            console.log(error.error);
        });
    }

    return (
        <Container>
            <Row>
                <Col md={5} className="mb-2 mb-md-0">{todoItem.description}</Col>
                <Col md={3} className="mb-2 mb-md-0">{`${formattedDate.getYear()}-${formattedDate.getMonth()}-${formattedDate.getDay()}`}</Col>
                <Col md={1} className="mb-2 mb-md-0">{todoItem.priority_levels}</Col>
                <Col md={1} className="mb-2 mb-md-0">{todoItem.is_done ? 
                    <Button disabled variant="success">
                        <i className="gg-check-o"></i>
                    </Button> : 
                    <Button onClick={() => onFetchMarkDone(todoItem.todo_id)} variant="outline-success">
                        <i className="gg-radio-check"></i>
                    </Button>}
                </Col>
                <Col md={1} className="mb-2 mb-md-0"><Button variant="danger" onClick={() => onFetchDeleteTodo(todoItem.todo_id)}><i className="gg-trash"></i></Button></Col>
            </Row>
        </Container>
    )
}

export default TodoItem;
