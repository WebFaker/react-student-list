import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import { Tasks } from '../api/tasks.js';

// Task component - represents a single todo item
export default class Task extends Component {

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
      <div className={"tile " + taskClassName}>
        <span className="text"><br/>
          {/* <strong>Créé par </strong>: {this.props.task.username}<br/> */}
          <p className="tile_text">{this.props.task.name} {this.props.task.surname}</p>
          <p className="tile_text">{this.props.task.mail}</p>
          <p className="tile_note">{this.props.task.note}/20</p>
          <div className="action_container">
            { this.props.showPrivateButton ? (
              <button className="action lock toggle-private" onClick={this.togglePrivate.bind(this)}>
                { this.props.task.private ? '🔒' : '🔓' }
              </button>
            ) : ''}
            <div className="action edit">
              <img className="edit_img" src="https://media.discordapp.net/attachments/324642605822640128/535123981066567710/edit.png" alt="Éditer"/>
            </div>
            { this.props.showPrivateButton ? (
            <div className="action delete" onClick={this.deleteThisTask.bind(this)}>
              <img className="delete_img" src="https://media.discordapp.net/attachments/324642605822640128/535123985713594368/rubbish-bin.png" alt="Supprimer"/>
            </div>
            ) : ''}
          </div>
        </span>
      </div>
    );
  }
}
