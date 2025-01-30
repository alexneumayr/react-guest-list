import './App.css';
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
} from './util/api-functions.js';

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [shownGuests, setShownGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({ status: 'all' });
  const [editMode, setEditMode] = useState(false);
  const [changedFirstName, setChangedFirstName] = useState('');
  const [changedLastName, setChangedLastName] = useState('');
  const [guestToEdit, setGuestToEdit] = useState({});

  useEffect(() => {
    getGuests(setShownGuests, filter, isLoading, setIsLoading).catch((error) =>
      console.log(error),
    );
  }, [filter, isLoading, editMode]);

  function handleTopFormSubmit(event) {
    event.preventDefault();
    if (firstName && lastName) {
      createGuest(firstName, lastName).catch((error) => console.log(error));
      setFirstName('');
      setLastName('');
    } else {
      alert('Please input both first name and last name');
    }
  }

  function handleFilterCheckboxClicked(event) {
    const tempFilter = { status: event.currentTarget.value };
    setFilter(tempFilter);
  }

  function handleGuestDoubleclick(id) {
    setEditMode(true);
    getSingleGuestForEditing(
      id,
      setGuestToEdit,
      setChangedFirstName,
      setChangedLastName,
    ).catch((error) => console.log(error));
  }

  return (
    <>
      <form onSubmit={handleTopFormSubmit}>
        <label htmlFor="first-name-input">First name</label>
        <input
          id="first-name-input"
          value={firstName}
          onChange={(event) => setFirstName(event.currentTarget.value)}
          disabled={isLoading}
        />
        <br />
        <label htmlFor="last-name-input">Last name</label>
        <input
          id="last-name-input"
          value={lastName}
          onChange={(event) => setLastName(event.currentTarget.value)}
          disabled={isLoading}
        />
        <input type="submit" hidden />
      </form>
      {isLoading ? (
        'Loading...'
      ) : (
        <div>
          {shownGuests.map((guest) => {
            return (
              <div data-test-id="guest" key={`guest-${guest.id}`}>
                <div
                  style={{ display: 'inline' }}
                  onDoubleClick={() => handleGuestDoubleclick(guest.id)}
                >
                  {guest.firstName} {guest.lastName}
                </div>
                <button onClick={() => deleteGuest(guest.id)}>Remove</button>
                <input
                  type="checkbox"
                  checked={guest.attending}
                  aria-label={`${guest.firstName} ${guest.lastName} attending status`}
                  onChange={(event) => {
                    toggleGuestAttending(
                      guest.id,
                      event.currentTarget.checked,
                    ).catch((error) => console.log(error));
                  }}
                />
              </div>
            );
          })}
          <button onClick={() => deleteAllAttendingGuests(shownGuests)}>
            Remove all attending guests
          </button>
          <fieldset>
            <legend>Filter</legend>

            <div>
              <input
                type="radio"
                id="all"
                value="all"
                name="filter-selection"
                onClick={handleFilterCheckboxClicked}
                defaultChecked
              />
              <label htmlFor="all">all</label>
            </div>
            <div>
              <input
                type="radio"
                id="attending"
                value="attending"
                name="filter-selection"
                onClick={handleFilterCheckboxClicked}
              />
              <label htmlFor="attending">attending</label>
            </div>
            <div>
              <input
                type="radio"
                id="notattending"
                value="notattending"
                name="filter-selection"
                onClick={handleFilterCheckboxClicked}
              />
              <label htmlFor="notattending">not attending</label>
            </div>
          </fieldset>
          {editMode && (
            <EditGuestForm
              changedFirstName={changedFirstName}
              setChangedFirstName={setChangedFirstName}
              changedLastName={changedLastName}
              setChangedLastName={setChangedLastName}
              isLoading={isLoading}
              setEditMode={setEditMode}
              updateGuestNames={updateGuestNames}
              guestToEdit={guestToEdit}
            />
          )}
        </div>
      )}
    </>
  );
}
