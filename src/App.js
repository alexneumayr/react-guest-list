import './App.css';
import { useEffect, useState } from 'react';

const baseUrl = 'http://localhost:4000';

async function createGuest(firstName, lastName) {
  const response = await fetch(`${baseUrl}/guests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ firstName: firstName, lastName: lastName }),
  });
  const createdGuest = await response.json();
  console.log('API response from createGuest()', createdGuest);
}

async function deleteGuest(id) {
  const response = await fetch(`${baseUrl}/guests/${id}`, { method: 'DELETE' });
  const deletedGuest = await response.json();
  console.log('API response from deleteGuest()', deletedGuest);
}

async function toggleGuestAttending(id, checkboxStatus) {
  const response = await fetch(`${baseUrl}/guests/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ attending: checkboxStatus }),
  });
  const updatedGuest = await response.json();
  console.log('API response from toggleGuestAttending()', updatedGuest);
}

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

  async function updateGuestNames(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: changedFirstName,
        lastName: changedLastName,
      }),
    });
    const updatedGuest = await response.json();
    console.log('API response from updateGuestNames()', updatedGuest);
  }

  function deleteAllAttendingGuests() {
    const allAttendingGuests = shownGuests.filter((guest) => guest.attending);
    allAttendingGuests.forEach((guest) => {
      deleteGuest(guest.id).catch((error) => console.log(error));
    });
  }

  function filterGuests(guestArray) {
    switch (filter.status) {
      case 'attending':
        return guestArray.filter((guest) => guest.attending);
      case 'notattending':
        return guestArray.filter((guest) => !guest.attending);
      case 'all':
        return guestArray;
      default:
        throw new Error('Error filtering guests');
    }
  }

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

  async function getGuests() {
    const response = await fetch(`${baseUrl}/guests`);
    setShownGuests(filterGuests(await response.json()));
    if (isLoading) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getGuests().catch((error) => console.log(error));
  });

  function handleFilterCheckboxClicked(event) {
    const tempFilter = { status: event.currentTarget.value };
    setFilter(tempFilter);
  }

  async function getSingleGuestForEditing(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`);
    const guestForEditing = await response.json();
    setGuestToEdit(guestForEditing);
    setChangedFirstName(guestForEditing.firstName);
    setChangedLastName(guestForEditing.lastName);
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
                  onDoubleClick={() => {
                    setEditMode(true);
                    getSingleGuestForEditing(guest.id).catch((error) =>
                      console.log(error),
                    );
                  }}
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
          <button onClick={() => deleteAllAttendingGuests()}>
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
            <div>
              <form>
                <label htmlFor="first-name-input">First name</label>
                <input
                  id="first-name-input"
                  value={changedFirstName}
                  onChange={(event) =>
                    setChangedFirstName(event.currentTarget.value)
                  }
                  disabled={isLoading}
                />
                <br />
                <label htmlFor="last-name-input">Last name</label>
                <input
                  id="last-name-input"
                  value={changedLastName}
                  onChange={(event) =>
                    setChangedLastName(event.currentTarget.value)
                  }
                  disabled={isLoading}
                />
                <br />
                <button
                  type="button"
                  onClick={() => {
                    updateGuestNames(guestToEdit.id).catch((error) =>
                      console.log(error),
                    );
                    setEditMode(false);
                  }}
                >
                  Save changes
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                  }}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
