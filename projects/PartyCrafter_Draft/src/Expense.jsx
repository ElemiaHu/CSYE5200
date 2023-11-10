import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import MyDate from "./date";
import { fetchDeleteExpense } from "./services";

function Expense({ expense, onFetchEventExpenses, eventId }) {
    function onFetchDeleteExpense(expenseId) {
        fetchDeleteExpense(expenseId).then(() => {
            onFetchEventExpenses(eventId);
        })
        .catch( error => {
            console.log(error.error);
        });
    }

    const formattedDate = new MyDate(expense.date_spent);

    return (
        <Container>
            <Row>
                <Col md={4}>{expense.expense_description}</Col>
                <Col md={3}>
                    {`${formattedDate.getYear()}-${formattedDate.getMonth()}-${formattedDate.getDay()}`}
                </Col>
                <Col md={3}>${expense.amount_spent}</Col>
                <Col><Button variant="danger" onClick={() => {onFetchDeleteExpense(expense.expense_id)}}><i class="gg-trash"></i></Button></Col>
            </Row>
        </Container>
        
    );
}

export default Expense;