import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

import { Container, Row, Col, Alert, Navbar, Nav, Form, Button, Modal } from 'react-bootstrap';


// App component - represents the whole app
class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      hideCompleted: false,
    };
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();


    // Find the text field via the React ref
    // const text = this.refs.input_text;
    const text = document.getElementById('input_text').value;
    // const text = React.findDOMNode(this.refs.cpDev1).value;

    console.log(text);

    Meteor.call('tasks.insert', text);

    // Clear form
  } // Connected with 'Submit' button

  toggleShowCompleted(){
    this.setState({
      showCompleted: !this.state.showCompleted,
    });
  } // Showing hided tasks

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  } // Hiding added tasks

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        /> // Rendering added tasks
      );
    });
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    return (

      <div>
        <center>
          <header>
             <nav>
               <h1 className="logo">"BIRYUK"</h1>
               <ul>
               <li><a href="#">Complaints</a></li>
               <li><a href="#">Offers</a></li>
               <li className="account">
               <Form inline>
                 <Button variant="dark"><AccountsUIWrapper /></Button>
               </Form>
               </li>
               </ul>
             </nav>
          </header>
        </center>
        <Container style={{paddingTop:'5%'}} className="tasks">
          <Row style={{paddingBottom:'5%'}}>
            <Col>
              {this.renderTasks()}
            </Col>
          </Row>
          <Row className="new task">

            <Button variant="outline-success" onClick={this.handleShow} className="button-AddNewTask">Add new task </Button>
            <div>
              <label className="hide-completed">
                <Button type="button" variant="primary" checked={this.state.hideCompleted} onClick={this.toggleHideCompleted.bind(this)}>
                 Hide completed
                </Button>
              </label>
            </div>

            <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
              <Form
                noValidate
                onSubmit={e => this.handleSubmit(e)}
              >
              <Modal.Header closeButton>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    required
                    id="title_text"
                    type="text"
                    placeholder="Title"
                    ref="cpDev1"
                    defaultValue=""
                  />
                </Form.Group>
              </Modal.Header>

              <h3 align="center">Your text</h3>
              <Form.Group>
                <Form.Label>Text</Form.Label>
                <Form.Control type="text" id="input_text" placeholder="task" required />
              </Form.Group>
                <center>
                <Button variant="danger"  className="closeButton" onClick={this.handleClose}>
                  Close
                </Button>
                <Button type="submit">Submit form</Button>
                </center>
                </Form>
            </Modal>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('tasks');

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
})(App);
