import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import Dialog from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import DatePicker from 'material-ui/DatePicker';
import Toggle from 'material-ui/Toggle';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';

import * as theme from './homePage.jsx';  // * does all named exports from that file
import * as tripStyle from './trip.jsx';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { cyan50, cyan100, cyan200, cyan300, cyan400, cyan500, cyan600, cyan700, cyan800, cyan900 } from 'material-ui/styles/colors';

import * as actions from '../actions/index.js';
import Activity from './activity.jsx';
import UserPage from './userPage.jsx';
import Events from './events.jsx';
import Signup from './signup.jsx';
import Login from './login.jsx';
import Eatin from './restaurants.jsx';

export const styles = {
  activityContainer: {
    display: 'inline-block',
    marginBottom: '1%',
    marginLeft: '2%',
    marginTop: '1%',
    verticalAlign: 'top',
    width: '47%'
  },
  activityTitle: {
    backgroundColor: '#f9f9f9',
    color: cyan800,
    fontSize: 20,
    fontWeight: 'bold',
    padding: '1%',
    margin: '2%',
    textAlign: 'left'
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: '0 !important'
  },
  createTripCard: {
    display: 'inline-block',
    marginLeft: '19%',
    marginTop: '1%',
    width: '30%',
  },
  existingTripsCard: {
    display: 'inline-block',
    marginTop: '1%',
    marginLeft: '2%',
    verticalAlign: 'top',
    width: '30%',
  },
  navButtons: {
    marginRight: '1em',
    marginLeft: '1em'
  },
  searchBar: {
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  searchInput: {
    width: '80%'
  },
  searchResults: {
    margin: '2%'
  },
  tripDatesCard: {
    display: 'flex',
    flexFlow: 'column wrap'
  },
  tripDatesHeaders: {
    backgroundColor: '#f9f9f9',
    color: cyan900,
    fontSize: 15,
    fontWeight: 'bold',
    padding: '1%'
  },
  welcomeUser: {
    marginTop: '1%'
  }
}

class SearchPage extends React.Component {
  constructor (props) {
    super(props);
    if (props.state.userTrips.length !== 0  && props.state.activeTrip.status) {
      this.state = {
        open: true,
        activeCity: props.state.userTrips[props.state.activeTrip.index].city,
        dropdown: props.state.userTrips[props.state.activeTrip.index].city,
        activeFromDate: props.state.userTrips[props.state.activeTrip.index].fromDate,
        activeToDate: props.state.userTrips[props.state.activeTrip.index].toDate,
        editDatesOpen: false,
        tempFromDate: props.state.userTrips[props.state.activeTrip.index].fromDate,
        tempToDate: props.state.userTrips[props.state.activeTrip.index].toDate
      }
    } else if (props.state.userTrips.length !== 0) {
      this.state = {
        open: false,
        activeCity: props.state.userTrips[props.state.activeTrip.index].city,
        dropdown: 0,
        activeFromDate: props.state.userTrips[props.state.activeTrip.index].fromDate,
        activeToDate: props.state.userTrips[props.state.activeTrip.index].toDate,
        editDatesOpen: false,
        tempFromDate: props.state.userTrips[props.state.activeTrip.index].fromDate,
        tempToDate: props.state.userTrips[props.state.activeTrip.index].toDate
      }
    } else {
      this.state = {
        open: false,
        dropdown: 0,
        editDatesOpen: false
      }
    }
  }

  updateCity (event, index, value) {
    if (value && index !== 0) {
      this.setState({dropdown: value, open: true});
      this.setState({activeCity: this.props.state.userTrips[index - 1].city});
      this.setState({activeFromDate: this.props.state.userTrips[index - 1].fromDate, activeToDate: this.props.state.userTrips[index - 1].toDate});
      this.props.actions.updateCity('');
      this.props.actions.activateTrip(index - 1);
    } else if (index === 0) {
      this.setState({ dropdown: value });
      this.props.actions.deactivate();
    } else {
      this.props.actions.updateCity(this.formatCity(event.target.value));
    }
  }

  formatCity (city) {
    const words = city.split(' ');
    let newWords = [];
    for (let word of words) {
      word = word.slice(0,1).toUpperCase().concat(word.slice(1).toLowerCase());
      newWords.push(word);
    }
    return newWords.join(' ');
  } 

  submit (event) {  // makes a new trip for logged in user
    let state = this.props.state;
    event.preventDefault();
    if (state.authenticated) {
      if (state.city !== '' && state.tripFromDate !== '' && state.tripToDate !== '') {
        this.props.actions.makeNewTrip(state.username, state.city, state.userTrips.length, state.tripFromDate, state.tripToDate);
        this.setState({ activeCity: state.city, open: true, activeFromDate: state.tripFromDate, activeToDate: state.tripToDate});
      }
    }
  };

/***************************** Event - search **********************************/
  updateEventQuery(event) {
    this.props.actions.updateEventQuery(event.target.value)
  };

  submitEventQuery (event) {
    let state = this.props.state;
    event.preventDefault();
    if ((state.activeTrip.status || state.city) && state.eventQuery) {
      let city = state.activeTrip.status ? this.state.activeCity : state.city;
      this.props.actions.searchEvents(this.state.activeCity, state.eventQuery, this.state.activeFromDate, this.state.activeToDate);
    } else {
      window.alert('Please select a city and search terms first!');
    }
  };

/***************************** Food - search **********************************/
  updateFoodQuery (event) {
    this.props.actions.updateFoodQuery(event.target.value)
  };

  submitFoodQuery (event) {
    let state = this.props.state;
    event.preventDefault();

    if(state.activeTrip.status || state.city) {
      let city = state.activeTrip.status ? this.state.activeCity : state.city;
      this.props.actions.searchForFood(this.state.activeCity, this.props.state.foodQuery)
    } else {
      window.alert('Please select a city and search terms first!')
    }
  };

/***************************** MESSAGE *****************************/
  render () {
    let message =  '';
    let messageEvents = '';
    let messageFood = '';
    let activeCity = this.state.activeCity;
    let state = this.props.state;
    let actions = this.props.actions;

    if (!state.activeTrip.status) {
      message = 'Pick a city for your trip!';
      messageEvents = 'First pick a city before searching events!';
      messageFood = '';
    } else {
      message = `You\'re going to ${activeCity}! \n Or plan a different trip: `;
      messageEvents = `Type a keyword to find events in ${activeCity}!`;
      messageFood= `Or search for food in ${activeCity}!`;
    }

  /*************************** DATE SELECTION STUFF ***************************/
    let today = new Date();

    let formatDate = (date) => {
      // Dates need to be in YYYY-MM-DD format
      return moment(date).format('YYYY-MM-DDT00:00:00.000Z');
    }

    let updateFromDate = (event, date) => {
      let fromDate;
      if (date !== '') {
        fromDate = formatDate(date);
      } else {
        fromDate = '';
      }

      actions.updateFromDate(fromDate);

      // This sets minimum "To" date based on the current "From" date in the correct date format
      if (date !== '') {
        actions.setMinToDate(date);
      } else {
        actions.setMinToDate({});
      }

      this.setState({
        activeFromDate: fromDate
      });
    }

    const updateToDate = (event, date) => {
      let toDate;
      if (date !== '') {
        toDate = formatDate(date);
      } else {
        toDate = '';
      }
      actions.updateToDate(toDate);

      this.setState({
        activeToDate: toDate
      });
    };

    const submitEditDates = () => {
      let state = this.props.state;
      let city = state.userTrips[state.activeTrip.index].city;
      let newFromDate = state.tripFromDate;
      let newToDate = state.tripToDate;

      // updates trip dates in the db
      actions.updateTripDates(state.username, city, newFromDate, newToDate);

      state.userTrips[state.activeTrip.index].fromDate = state.tripFromDate;
      state.userTrips[state.activeTrip.index].toDate = state.tripToDate;

      this.setState({
        activeFromDate: newFromDate,
        activeToDate: newToDate,
        tempFromDate: newFromDate,
        tempToDate: newToDate,
        editDatesOpen: false
      });
    };

    /*************************** EXISTING TRIPS DROPDOWN ***************************/
    const dropdown = () => {
      if (this.props.state.authenticated) {
        return (
          <div>
            <SelectField 
              value={this.state.dropdown} 
              onChange = {this.updateCity.bind(this)}
            > 
              <MenuItem primaryText = 'Make a New Trip' />
                {state.userTrips.map((trip, index) => 
                  <MenuItem
                    key = {index}
                    value = {trip.city}
                    primaryText = {trip.city} 
                  />
                )}
            </SelectField>
            <br/>
            <RaisedButton
              onClick={() => (this.setState({ open: !this.state.open }))}
              label='Show Details'
              disabled={!state.activeTrip.status}
            />
          </div>
        )
      } else {
        return (
          <div>Please login to view your current trips!</div>
        )
      }
    }

    /*************************** TRIP DETAILS SIDEBAR ***************************/
    const editDateActions = [
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={submitEditDates}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        style={{marginLeft: '2%'}}
        onClick={() => {
          updateFromDate(null, '');
          updateToDate(null, '');
          this.setState({
            editDatesOpen: false,
          });
        }}
      />
    ];

    const drawer = () => {
      if (state.activeTrip.status) {
        let activeTrip = state.userTrips[state.activeTrip.index]; 
        if (activeTrip) {
          let fromDate = moment(activeTrip.fromDate).format('MM/DD/YY');
          let toDate = moment(activeTrip.toDate).format('MM/DD/YY');
          return (
            <Drawer
              width={400}
              openSecondary={true}
              open={this.state.open}
            >
              <AppBar
                title={this.state.activeCity}
                iconElementLeft={
                  <IconButton
                    onClick={() => (this.setState({ open: false }))}
                  >
                    <NavigationClose />
                  </IconButton>}
              />
              <div style={{
                margin: '2%',
                fontSize: 25,
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {fromDate} - {toDate}
                <div style={{display: 'inline-block', marginLeft: '1%'}}>
                  <FlatButton
                    label="Edit"
                    onClick={() => this.setState({editDatesOpen: true})}
                    backgroundColor='transparent'
                    hoverColor='#f9f9f9'
                  />
                  <Dialog
                    title="Modify Trip Dates"
                    actions={editDateActions}
                    modal={false}
                    open={this.state.editDatesOpen}
                    onRequestClose={() => this.setState({editDatesOpen: false})}
                  >
                    <div
                      style={{color: cyan800}}
                    >Trip Dates for {this.state.activeCity}:
                    </div>

                    <div style={{
                      color: cyan900,
                      fontWeight: 'bold'
                    }}>{fromDate} - {toDate}</div>

                    <br/><br/>

                    Edit your trip dates below:
                    <DatePicker
                      floatingLabelText="From"
                      autoOk={true}
                      onChange={updateFromDate}
                      minDate={today}
                    />
                    <DatePicker
                      floatingLabelText="To"
                      autoOk={true}
                      onChange={updateToDate}
                      minDate={this.props.state.minToDate}
                    />
                  </Dialog>
                </div>
              </div>

              {showActivityDiv('event', activeTrip)}
              <div style={tripStyle.styles.tripDetails}>
                {activeTrip.events.map((event, index) => 
                  (<Activity
                    key={index}
                    sidebar = 'true'
                    type='event'
                    activity={event}
                    user={state.username}
                    city={this.state.activeCity}
                    deleteEvent={this.props.actions.deleteEvent}
                  />))}
              </div>
              
              {showActivityDiv('eatin', activeTrip)}
              <div style={tripStyle.styles.tripDetails}>
                {activeTrip.eatin.map((eatin, index) => 
                  (<Activity
                    key={index}
                    sidebar='true'
                    type='food'
                    user={state.username}
                    city={this.state.activeCity}
                    deleteFood={this.props.actions.deleteFood}
                    activity={eatin}
                  />))}
              </div>
            </Drawer>
          );
        }
      }
    }

    const navLinks = () => {
      if (state.authenticated) {
        return (
          <div style={theme.styles.navLinks}>
            <Link to='/'>
              <RaisedButton
                label="Home"
              />
            </Link>
            <Link to='trips'>
              <RaisedButton
                label="My Trips"
                disabled={!this.props.state.authenticated}
                style={styles.navButtons}
              />
            </Link>
            <Link to='/'>
              <RaisedButton
                disabled={!this.props.state.authenticated}
                onClick={this.props.actions.logOut}
                label='Log Out'
              />
            </Link>
          </div>
        );
      } else {
        return (
          <div style={theme.styles.navLinks}>
            <Link to='/'>
              <RaisedButton
                label="Home"
              />
            </Link>
            <Signup
              signup={actions.signup}
              username={state.username}
              password={state.password}
              updateUsername={actions.updateUsername}
              updatePassword={actions.updatePassword}
            />
            <Login
              login={actions.login}
              username={state.username}
              password={state.password}
              updateUsername={actions.updateUsername}
              updatePassword={actions.updatePassword}
            />
          </div>
        )
      }
    }

    /************************* ACTIVITY HEADER DIVS ******************************/
    const showActivityDiv = (activityType, trip) => {
      // If activity = event and there are events in the current trip
      if (activityType === 'event' && trip.events.length > 0) {
        return (
          <div style={tripStyle.styles.activityHeader}>Events:</div>
        )
      // If activity = eatin and there are restaurants in the current trip
      } else if (activityType === 'eatin' && trip.eatin.length > 0) {
        return (
          <div style={tripStyle.styles.activityHeader}>Food:</div>
        )
      }
    };

    /*************************** WELCOME USER TEXT ***************************/
    const welcomeUser = () => {
      if (this.props.state.authenticated) {
        return (
          <div style={theme.styles.discoverTrips}>Welcome back, {state.username}!</div>
        )
      } else {
        return (
          <div style={theme.styles.discoverTrips}>Welcome!</div>
        )
      }
    }

    /************************ CREATE TRIP SEARCH BUTTON ************************/
    const searchButton = () => {
      return (
        <RaisedButton
          onClick={this.submit.bind(this)}
          label='Create Trip'
          disabled={!this.props.state.authenticated}
        />
      )
    }

    /*************************** STUFF ON PAGE ***************************/
    return (
      <MuiThemeProvider muiTheme={theme.muiTheme}>
        <Paper>
          {/************************** NAVIGATION **************************/}
          {navLinks()}

          {/******************************* HEADER *******************************/}
          <div style={theme.styles.header}>
            <Link to="/" style={{textDecoration: 'none', color: cyan900}}>
              TripTeaze
            </Link>
          </div>

          <div style={styles.welcomeUser}>{welcomeUser()}</div>
          
          {/************************** CREATE TRIP CARD **************************/}
          <div style={styles.createTripCard}>
            {drawer()}
            <Card>
              <CardTitle
                title="Create New Trip"
                titleStyle={styles.cardTitle}
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardText
                expandable={true}
              >
                <div style={styles.tripDatesCard}>
                  <div style={styles.tripDatesHeaders}>Trip Dates:</div>
                  <div>
                    <DatePicker
                      floatingLabelText="From"
                      autoOk={true}
                      onChange={updateFromDate}
                      minDate={today}
                    />
                    <DatePicker
                      floatingLabelText="To"
                      autoOk={true}
                      onChange={updateToDate}
                      // defaultDate={} // set default "to" date as the "from" date?
                      minDate={this.props.state.minToDate}
                    />
                  </div>
                  <br/>
                  <div>
                    <div style={styles.tripDatesHeaders}> {message} </div>
                    <TextField
                      id='city'
                      value={this.props.state.city}
                      onChange={this.updateCity.bind(this)}
                    />
                    <br/>
                    {searchButton()}
                  </div>
                </div>
              </CardText>
            </Card>
          </div>

          {/************************** EXISTING TRIPS CARD **************************/}
          <div style={styles.existingTripsCard}>
            <Card
              initiallyExpanded={true}
            >
              <CardTitle
                title="Current Trips"
                titleStyle={styles.cardTitle}
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardText
                expandable={true}
              >
                {dropdown()}
              </CardText>
            </Card>
          </div>
          
          {/************************** EXPLORE SECTION **************************/}
          <div style={{marginTop: '3%'}}>
            <div style={theme.styles.discoverTrips}>Explore</div>
            {/************************** SEARCH EVENTS **************************/}
            <Paper style={styles.activityContainer}>
              <div style={styles.activityTitle}>Events</div>
              <div style={styles.searchBar}>
                <TextField
                  id = 'event'
                  onChange = {this.updateEventQuery.bind(this)}
                  inputStyle={{ width: '100%' }}
                  style={styles.searchInput}
                />
                <RaisedButton 
                  onClick={this.submitEventQuery.bind(this)} 
                  label='Search' 
                />
              </div>

              {/************************** EVENT RESULTS **************************/}
              <div style={styles.searchResults}>
                <Events
                  events={state.eventResults}
                  addEventToTrip={actions.addEventToTrip}
                  user={state.username}
                  city={this.state.activeCity}
                  eventSnackbar={state.eventSnackbar}
                  onRequestClose={actions.deactivateEventSnackbar}
                />
              </div>
            </Paper>

            {/************************** SEARCH EATIN **************************/}
            <Paper style={styles.activityContainer}>
            <div style={styles.activityTitle}>Restaurants</div>
              <div style={styles.searchBar}>
                <TextField
                  id='food'
                  onChange={this.updateFoodQuery.bind(this)}
                  inputStyle={{ width: '100%' }}
                  style={styles.searchInput}
                />
                <RaisedButton 
                  onClick={this.submitFoodQuery.bind(this)} 
                  label='Search'              
                />
              </div>

              {/************************** EATIN RESULTS **************************/}
              <div style={styles.searchResults}>
                <Eatin
                  restaurants={state.foodResults}
                  addFoodToTrip={actions.addFoodToTrip}
                  user={state.username}
                  city={this.state.activeCity}
                  foodSnackbar={state.foodSnackbar}
                  onRequestClose={actions.deactivateFoodSnackbar}
                />
              </div>
            </Paper>
          </div>
        </Paper>
      </MuiThemeProvider>
    );
  }  
}

const mapStateToProps = state => (
  { state: state }
);

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(actions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);