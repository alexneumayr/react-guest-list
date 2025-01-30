type Guest = {
  id: number;
  firstName: string;
  lastName: string;
  attending: boolean;
};

type Props = {
  changedFirstName: string;
  setChangedFirstName: (name: string) => void;
  changedLastName: string;
  setChangedLastName: (name: string) => void;
  isLoading: boolean;
  setEditMode: (isOn: boolean) => void;
  updateGuestNames: (
    id: number,
    changedFirstName: string,
    changedLastName: string,
  ) => Promise<void>;
  guestToEdit: Guest;
};

export default function EditGuestForm({
  changedFirstName,
  setChangedFirstName,
  changedLastName,
  setChangedLastName,
  isLoading,
  setEditMode,
  updateGuestNames,
  guestToEdit,
}: Props) {
  function handleSaveChangesButtonClick() {
    updateGuestNames(guestToEdit.id, changedFirstName, changedLastName).catch(
      (error) => console.log(error),
    );
    setEditMode(false);
  }
  return (
    <div>
      <form>
        <label htmlFor="first-name-input">First name</label>
        <input
          id="first-name-input"
          value={changedFirstName}
          onChange={(event) => setChangedFirstName(event.currentTarget.value)}
          disabled={isLoading}
        />
        <br />
        <label htmlFor="last-name-input">Last name</label>
        <input
          id="last-name-input"
          value={changedLastName}
          onChange={(event) => setChangedLastName(event.currentTarget.value)}
          disabled={isLoading}
        />
        <br />
        <button type="button" onClick={handleSaveChangesButtonClick}>
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
  );
}
