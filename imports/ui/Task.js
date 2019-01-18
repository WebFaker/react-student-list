import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import { Tasks } from '../api/tasks.js';

// Task component - represents a single todo item
export default class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
        editMode: false
    };
  }

  handleEdit (event) {
    event.preventDefault();

    const name = ReactDOM.findDOMNode(this.refs.name).value.trim();
    const surname = ReactDOM.findDOMNode(this.refs.surname).value.trim();
    const mail = ReactDOM.findDOMNode(this.refs.mail).value.trim();
    const note = ReactDOM.findDOMNode(this.refs.note).value.trim();

    Meteor.call('tasks.edit', this.props.task._id, name, surname, mail, note);

    this.setState( prev => ({ editMode: !prev.editMode }));
    console.log(this.state.editMode);
  }

  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  }

  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
  }

  toggleEditMode =()=> {
    this.setState( prev => ({ editMode: !prev.editMode }));
    console.log(this.state.editMode);
  }

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const taskClassName = classnames({      
      private: this.props.task.private,
    });

    const setPrivate = this.props.task.private ? 'is-active' : 'is-inactive';

    return (
      <div className={"tile " + taskClassName}>
      {!this.state.editMode && (
        <span className="text"><br/>
          {/* <strong>Créé par </strong>: {this.props.task.username}<br/> */}
          <p className="tile_names tile_text">{this.props.task.name} {this.props.task.surname}</p>
          <p className="tile_text">{this.props.task.mail}</p>
          <p className="tile_note">{this.props.task.note}/20</p>
          <div className="action_container">
            { this.props.showPrivateButton ? (
              <div className={"action lock toggle-private " + setPrivate} onClick={this.togglePrivate.bind(this)}>
                <img className="lock_img" src="https://cdn.discordapp.com/attachments/324642605822640128/535839048514797568/locked1.png" alt="Private"/>
              </div>
            ) : ''}
            { this.props.showPrivateButton ? (
            <div className="action edit" onClick={this.toggleEditMode}>
              <img className="edit_img" src="https://media.discordapp.net/attachments/324642605822640128/535123981066567710/edit.png" alt="Éditer"/>
            </div>
            ) : ''}
            { this.props.showPrivateButton ? (
            <div className="action delete" onClick={this.deleteThisTask.bind(this)}>
              <img className="delete_img" src="https://media.discordapp.net/attachments/324642605822640128/535123985713594368/rubbish-bin.png" alt="Supprimer"/>
            </div>
            ) : ''}
          </div>
        </span>
        )}
        {this.state.editMode && (
        <span className="text"><br/>
          {/* <strong>Créé par </strong>: {this.props.task.username}<br/> */}
          <form className="task" onSubmit={this.handleEdit.bind(this)}>
          <input
            required
            className="input"
            type="text"
            ref="name"
            placeholder="Nom"
            defaultValue={this.props.task.name}
          />
          <input
            required
            className="input"
            type="text"
            ref="surname"
            placeholder="Prénom"
            defaultValue={this.props.task.surname}
          />
          <input
            required
            className="input"
            type="text"
            ref="mail"
            placeholder="Github"
            defaultValue={this.props.task.mail}
          />
          <input
            required
            className="input"
            type="number"
            ref="note"
            max="20"
            maxLength="3"
            step=".1"
            placeholder="Note /20"
            defaultValue={this.props.task.note}
          />

          <input className="validate" type="submit" value="Valider"/>
          </form>
        </span>
        )}
      </div>
    );
  }
}
