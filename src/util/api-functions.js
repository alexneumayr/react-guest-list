const baseUrl = 'http://localhost:4000';

export async function createGuest(firstName, lastName) {
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

export async function deleteGuest(id) {
  const response = await fetch(`${baseUrl}/guests/${id}`, { method: 'DELETE' });
  const deletedGuest = await response.json();
  console.log('API response from deleteGuest()', deletedGuest);
}

export async function toggleGuestAttending(id, checkboxStatus) {
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

export async function updateGuestNames(id, changedFirstName, changedLastName) {
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

export function deleteAllAttendingGuests(shownGuests) {
  const allAttendingGuests = shownGuests.filter((guest) => guest.attending);
  allAttendingGuests.forEach((guest) => {
    deleteGuest(guest.id).catch((error) => console.log(error));
  });
}

export async function getGuests(
  setShownGuests,
  filter,
  isLoading,
  setIsLoading,
) {
  const response = await fetch(`${baseUrl}/guests`);
  const allGuests = await response.json();
  switch (filter.status) {
    case 'attending':
      setShownGuests(allGuests.filter((guest) => guest.attending));
      break;
    case 'notattending':
      setShownGuests(allGuests.filter((guest) => !guest.attending));
      break;
    case 'all':
      setShownGuests(allGuests);
      break;
    default:
      throw new Error('Error filtering guests');
  }

  if (isLoading) {
    setIsLoading(false);
  }
}

export async function getSingleGuestForEditing(
  id,
  setGuestToEdit,
  setChangedFirstName,
  setChangedLastName,
) {
  const response = await fetch(`${baseUrl}/guests/${id}`);
  const guestForEditing = await response.json();
  setGuestToEdit(guestForEditing);
  setChangedFirstName(guestForEditing.firstName);
  setChangedLastName(guestForEditing.lastName);
}
