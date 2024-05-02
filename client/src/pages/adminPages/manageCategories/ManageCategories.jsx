import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { apiWithAuth } from '../../../utils/ApiWrapper';

function ManageCategories() {
    const [categories, setCategories] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Fetch categories from the API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiWithAuth.get('/api/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Open the create category modal
    const handleCreateButtonClick = () => {
        setShowCreateModal(true);
    };

    // Close the create category modal
    const handleCreateModalClose = () => {
        setShowCreateModal(false);
        setNewCategoryName('');
    };

    // Handle creating a new category
    const handleCreateCategory = async () => {
        try {
            // Call the API to create the new category
            await apiWithAuth.post('/api/categories', { name: newCategoryName });

            // Refresh the list of categories
            const response = await apiWithAuth.get('/api/categories');
            setCategories(response.data);

            // Close the modal and reset the input field
            handleCreateModalClose();
        } catch (error) {
            console.error('Failed to create category:', error);
        }
    };

    // Open the delete confirmation modal
    const handleDeleteButtonClick = (category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    // Handle confirming the deletion of a category
    const handleConfirmDelete = async () => {
        try {
            // Call the API to delete the selected category
            await apiWithAuth.delete(`/api/categories/${selectedCategory._id}`);

            // Refresh the list of categories
            const response = await apiWithAuth.get('/api/categories');
            setCategories(response.data);

            // Close the delete confirmation modal
            setShowDeleteModal(false);
            setSelectedCategory(null);
        } catch (error) {
            console.error('Failed to delete category:', error);
        }
    };

    // Close the delete confirmation modal
    const handleDeleteModalClose = () => {
        setShowDeleteModal(false);
        setSelectedCategory(null);
    };

    return (
        <Container style={{ width: '60%', minHeight:"91vh" }}>
            <h2 className="mb-4">Manage Categories</h2>
            
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category, index) => (
                        <tr key={category._id}>
                            <td>{index + 1}</td>
                            <td>{category.name}</td>
                            <td>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteButtonClick(category)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Create Category Button */}
            <Button
                variant="primary"
                className="mt-4"
                onClick={handleCreateButtonClick}
            >
                Create Category
            </Button>

            {/* Create Category Modal */}
            <Modal show={showCreateModal} onHide={handleCreateModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formCategoryName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter category name"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCreateModalClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleCreateCategory}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this category?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteModalClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Confirm Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default ManageCategories;
