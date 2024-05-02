import React, { useState } from 'react';
import { apiWithoutAuth } from '../../utils/ApiWrapper';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

function VerifyEmail() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Send POST request to the email verification API endpoint
            const response = await apiWithoutAuth.post('/api/auth/verify-email', {
                email,
                otp,
            });

            // If verification is successful, navigate to the login page or display a success message
            if (response.data.message === 'Email verified successfully') {
                alert('Email verified successfully! Please login.');
                navigate('/login');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Email verification failed:', error);
            // Handle verification failure (e.g., display error message)
        }
    };

    return (
        <Container style={{
            height:"91vh"
        }}>
        <Container style={{ width:"80%", backgroundColor:"grey", minHeight:"40vw", justifyContent:"center", borderRadius:"20px", paddingTop:"7vw", paddingBottom:"7vw", marginBottom:"3vw" }}>
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="mb-4">Verify Email</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formEmail" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formOtp" className="mb-3">
                            <Form.Label>OTP</Form.Label>
                            <Form.Control
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter the OTP"
                                required
                            />
                        </Form.Group>

                        <Button type="submit" variant="primary">
                            Verify Email
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
        </Container>
    );
}

export default VerifyEmail;