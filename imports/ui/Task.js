import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import { Tasks } from '../api/tasks.js';

import { Container, Row, Col, Button, Form } from 'react-bootstrap';

// Task component - represents a single todo item
export default class Task extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  }

  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  }

  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
  }

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private,
    });

    return (
      <Row style={{paddingBottom:'3%'}}>
        <Col md={2}>
          <Form.Check type="checkbox" readOnly
          checked={!!this.props.task.checked}
          onClick={this.toggleChecked.bind(this)} />
        </Col>
        <Col md={3}>
          { this.props.showPrivateButton ? (
            <Button variant="primary" onClick={this.togglePrivate.bind(this)}>
              { this.props.task.private ? 'Private' : 'Public' }
            </Button>
          ) : ''}
        </Col>
        <Col md={5}>
          <span className="text">
            <strong>{this.props.task.username}</strong>: {this.props.task.title} : {this.props.task.text}
          </span>
        </Col>
        <Col md={2}>
          <Button variant="danger" onClick={this.deleteThisTask.bind(this)}>
            &times;
          </Button>
        </Col>
      </Row>
    );
  }
}
