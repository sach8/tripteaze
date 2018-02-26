import React from 'react';
import ReactDOM from 'react-dom';
import Events from './events.jsx';
import { connect } from 'react-redux';
import * as actions from '../actions/index.js';
import { bindActionCreators } from 'redux';

const StatePage = (props) => {

  const updateCity = (event) => {
    props.actions.updateCity(event.target.value)
  };

  const updateEventQuery = (event) => {
    props.actions.updateEventQuery(event.target.value)
  };

  const submit = (event) => {
    event.preventDefault();
    if (props.state.city !== '') {
      props.actions.makeNewTrip(props.state.username, props.state.city)
    }
  };

  const submitEventQuery = (event) => {
    event.preventDefault();
    if (props.state.activeTrip.status) {
      props.actions.searchEvents(props.state.activeTrip.city, props.state.eventQuery)
    } else {
      window.alert('Please select a city for your trip first!');
    }
  };

  let message = '';
  let messageEvents = '';
  if (!props.state.activeTrip.status) {
    message = 'Pick a city for your trip!';
    messageEvents = 'First pick a city before searching events!';
  } else {
    message = `You\'re going to ${props.state.activeTrip.city}! \n Or plan a different trip: `; 
    messageEvents = `Type a keyword to find events in ${props.state.activeTrip.city}!`;
  }
  let showEvents = '';
  if(props.state.eventResults.length !==0) {
    showEvents = <Events events={props.state.eventResults} />
  }

  return (
    <div>
      {message}
      <form onSubmit = {submit}>
        <input type='text' onChange = {updateCity}/>
        <input type='submit' value='Create Trip'/>
      </form>

      {messageEvents}
      <form onSubmit = {submitEventQuery}>
        <input type='text' onChange = {updateEventQuery}/>
        <input type='submit' value='Search events for your trip!'/>
      </form>
      {showEvents}

      PUT SEARCH FIELDS HERE
    </div>
  )
}


const mapStateToProps = state => (
  { state: state }
);

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(actions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(StatePage);

