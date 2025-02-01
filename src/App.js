import './App.css';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import EditGuestForm from './EditGuestForm/EditGuestForm';
import {
  createGuest,
  deleteAllAttendingGuests,
  deleteGuest,
  getGuests,
  getSingleGuestForEditing,
  toggleGuestAttending,
  updateGuestNames,
} from './util/api-functions';

// Defines data types of the guest object for TypeScript
type Guest = {
  id: number;
  firstName: string;
  lastName: string;
  attending: boolean;
};

export default function App() {
  const [firstName, setFirstName] = useState(''); // state of the input field for the first name
  const [lastName, setLastName] = useState(''); // state of the input field for the last name
  const [shownGuests, setShownGuests] = useState([
    {
      id: 0,
      firstName: 'test',
      lastName: 'user',
      attending: false,
    },
  ]); // state of the displayed guest list (for TypeScript it needs to already have a guest item)
  const [isLoading, setIsLoading] = useState(true); // state to track if the guest list has been fetched
  const [filter, setFilter] = useState({ status: 'all' }); // state of the filter for the guest list
  const [editMode, setEditMode] = useState(false); // state of the edit mode
  const [changedFirstName, setChangedFirstName] = useState(''); // state of first name input in edit mode
  const [changedLastName, setChangedLastName] = useState(''); // state of last name input in edit mode
  const [guestToEdit, setGuestToEdit] = useState({
    id: 0,
    firstName: '',
    lastName: '',
    attending: false,
  }); // state of the guest who is is being changed in edit mode (initialised for TypeScript)

  // Fetches the guest list on first render and when something changes
  useEffect(() => {
    getGuests(setShownGuests, filter, isLoading, setIsLoading).catch((error) =>
      console.log(error),
    );
  }, []);

  // Creates a new user and clears input fields when the Enter key is pressed
   function handleTopFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Checks if the user has typed in the full name
    if (firstName && lastName) {
       createGuest(firstName, lastName).then(guestFromApiResponse => setShownGuests([...shownGuests, guestFromApiResponse])).catch((error) => console.log(error));
      setFirstName('');
      setLastName('');

    } else {
      // Displays an alert if the user has not typed in the full name
      alert('Please input both first name and last name');
    }
  }

  // Sets the filter accordingly when the filter radio button has been changed
  function handleFilterCheckboxChanged(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const tempFilter = { status: event.currentTarget.value };
    setFilter(tempFilter);
  }

  // Starts edit mode when the user double-clicks on a guest name
  function handleGuestClick(id: number) {
    setEditMode(true);
    getSingleGuestForEditing(
      id,
      setGuestToEdit,
      setChangedFirstName,
      setChangedLastName,
    ).catch((error) => console.log(error));
  }

  return (
    <div className="App">
      <header>
        <h1>Guest list</h1>
      </header>
      <main>
        <div className="page-top-container">
          <div className="page-top">
            {/* Form containing the input fields for the names */}
            <form onSubmit={handleTopFormSubmit} className="name-input-form">
              <label className="name-label" htmlFor="first-name-input">
                First name
              </label>
              <input
                className="name-input"
                id="first-name-input"
                value={firstName}
                onChange={(event) => setFirstName(event.currentTarget.value)}
                disabled={isLoading}
                placeholder="Type in the first name of the guest"
              />
              <br />
              <label className="name-label" htmlFor="last-name-input">
                Last name
              </label>
              <input
                className="name-input"
                id="last-name-input"
                value={lastName}
                onChange={(event) => setLastName(event.currentTarget.value)}
                disabled={isLoading}
                placeholder="Type in the last name of the guest"
              />
              {/* Hidden submit button to allow form submit when the user presses the Enter key */}
              <input type="submit" hidden />
            </form>
            {/* Shows the filter for the guest list */}
            <fieldset className="filter">
              <legend>Filter</legend>
              <div className="mainFilter">
                <div>
                  <input
                    type="radio"
                    id="attending"
                    value="attending"
                    name="filter-selection"
                    onChange={handleFilterCheckboxChanged}
                    checked={filter.status === 'attending'}
                  />
                  <label htmlFor="attending">attending</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="notattending"
                    value="notattending"
                    name="filter-selection"
                    onChange={handleFilterCheckboxChanged}
                    checked={filter.status === 'notattending'}
                  />
                  <label htmlFor="notattending">not attending</label>
                </div>
              </div>
              <button
                className="reset-filter-button"
                onClick={() => setFilter({ status: 'all' })}
              >
                Reset filter
              </button>
              <button
                className="remove-all-attending-guests-button"
                onClick={() => deleteAllAttendingGuests(shownGuests, setShownGuests)}
              >
                Remove all attending guests
              </button>
            </fieldset>
          </div>
        </div>
        {/* Display loading message as long as the guest list hasn't been fetched */}
        {isLoading ? (
          <div className="loading-container">Loading...</div>
        ) : (
          /* Display the guest list after it has been fetched */
          <div className="all-guests-outer-container">
            {/* Only shows guest list container when there are guests to display.
            Otherwise there would just be a collapsed dark border if there are no guests. */}
            {shownGuests.length > 0 && (
              <div className="all-guests-container">
                {/* Map through the guest array and display the properties and the related buttons and checkboxes */}
                {shownGuests.map((guest: Guest) => {
                  return (
                    <div
                      className="guest-container"
                      data-test-id="guest"
                      key={`guest-${guest.id}`}
                      onDoubleClick={() => handleGuestClick(guest.id)}
                    >
                      {/* Shows attending check box */}
                      <input
                        type="checkbox"
                        checked={guest.attending}
                        aria-label={`${guest.firstName} ${guest.lastName} attending status`}
                        onChange={(event) => {
                          toggleGuestAttending(
                            guest.id,
                            event.currentTarget.checked,

                          ).then(guestFromApiResponse => {const newShownGuests = shownGuests.map(singleGuest => {
                            if (singleGuest.id === guestFromApiResponse.id) {
                              return guestFromApiResponse;
                            } else {
                              return singleGuest;
                            }});
                            setShownGuests(newShownGuests);}).catch((error) => console.log(error));
                        }}
                      />
                      {/* Shows guest name */}
                      <div className="guest-name">
                        {guest.firstName} {guest.lastName}
                      </div>
                      {/* Shows remove button */}
                      <button
                        className="remove-button"
                        aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                        onClick={() => deleteGuest(guest.id).then(guestFromApiResponse => setShownGuests(shownGuests.filter(currentGuest => currentGuest.id !== guestFromApiResponse.id)))}
                      >
                        <FontAwesomeIcon
                          className="remove-icon"
                          icon={faXmark}
                          color="red"
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {/* If edit mode is on it displays input fields to change the names of the guest */}
            {editMode && (
              <div className="guest-edit-form">
                <div className="guest-edit-header">
                  <h2>Edit guest</h2>
                </div>
                <EditGuestForm
                  changedFirstName={changedFirstName}
                  setChangedFirstName={setChangedFirstName}
                  changedLastName={changedLastName}
                  setChangedLastName={setChangedLastName}
                  isLoading={isLoading}
                  setEditMode={setEditMode}
                  updateGuestNames={updateGuestNames}
                  guestToEdit={guestToEdit}
                  shownGuests={shownGuests}
                  setShownGuests={setShownGuests}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
