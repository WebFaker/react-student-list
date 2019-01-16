import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('cc');

    // Find the text field via the React ref
    const name = ReactDOM.findDOMNode(this.refs.name).value.trim();
    const surname = ReactDOM.findDOMNode(this.refs.surname).value.trim();
    const mail = ReactDOM.findDOMNode(this.refs.mail).value.trim();
    const note = ReactDOM.findDOMNode(this.refs.note).value.trim();

    Meteor.call('tasks.insert', name, surname, mail, note);

    // Clear form
    ReactDOM.findDOMNode(this.refs.name).value = '';
    ReactDOM.findDOMNode(this.refs.surname).value = '';
    ReactDOM.findDOMNode(this.refs.mail).value = '';
    ReactDOM.findDOMNode(this.refs.note).value = '';
  }

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
        />
      );
    });
  }

  render() {
    return (
      <div className="global">
        <div className="profile">
          <img className="profile_img" src="https://cdn.discordapp.com/attachments/324642605822640128/535119019997659148/avataaars.png" alt="Coucou !"/>
          <p className="profile_text">Bonjour !</p>
          <AccountsUIWrapper />
        </div>
        <div className="content">
          <div className="tile">
            <h1>Liste des élèves - {this.props.incompleteCount} entrées</h1>

            { this.props.currentUser ?
              <form className="task" onSubmit={this.handleSubmit.bind(this)} >
                <input
                  className="input"
                  type="text"
                  ref="name"
                  placeholder="Nom"
                />
                <input
                  className="input"
                  type="text"
                  ref="surname"
                  placeholder="Prénom"
                />
                <input
                  className="input"
                  type="text"
                  ref="mail"
                  placeholder="Github"
                />
                <input
                  className="input"
                  type="number"
                  ref="note"
                  max="20"
                  maxlength="3"
                  step=".1"
                  placeholder="Note /20"
                />

                <input className="validate" type="submit" value="Valider"/>
              </form> : ''
            }
          </div>

            {this.renderTasks()}
        </div>
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
