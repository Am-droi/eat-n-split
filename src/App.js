import { createContext, useContext, useState } from "react";
import "./index.css";
const initialFriends = [
  {
    id: 546778,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 76656,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 98980,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

const FriendContext = createContext();

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [isOpen, setIsOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(null);

  const handleOpen = () => {
    setIsOpen((is) => !is);
  };

  const onAddFriends = (newFriend) => {
    setFriends((friends) => [...friends, newFriend]);
  };

  const handleSelection = (friendObj) => {
    setIsSelected((is) => (is?.id === friendObj.id ? null : friendObj));
  };

  const onSplitBill = (value) => {
    console.log(value);
    setFriends(
      friends.map((friendObj) =>
        isSelected.id === friendObj.id
          ? { ...friendObj, balance: friendObj.balance + value }
          : friendObj
      )
    );
    setIsSelected(false);
  };

  return (
    <div className="app">
      <FriendContext.Provider
        value={{
          isSelected,
          friends,
          onSelection: handleSelection,
          onAddFriends,
          setIsOpen,
          isOpen,
          onSplitBill,
        }}
      >
        <div>
          <FriendList />
          <AddFriend />
          <button className="button right" onClick={handleOpen}>
            {" "}
            {isOpen ? "close" : "add friend"}
          </button>
        </div>
        {isSelected && <SplitBill key={isSelected.id} />}
      </FriendContext.Provider>
    </div>
  );
}

function FriendList() {
  const { friends } = useContext(FriendContext);
  return (
    <ul className="sidebar">
      {friends.map((friend) => (
        <Friend friendObj={friend} />
      ))}
    </ul>
  );
}

function Friend({ friendObj }) {
  const { isSelected, onSelection } = useContext(FriendContext);
  const wasSelected = friendObj.id === isSelected?.id; //true

  return (
    <li className={wasSelected ? "selected" : ""}>
      <h3>{friendObj.name}</h3>
      <img src={friendObj.image} alt={friendObj.name} />
      {friendObj.balance < 0 && (
        <p className="red">
          you owe {friendObj.name} {Math.abs(friendObj.balance)}{" "}
        </p>
      )}
      {friendObj.balance > 0 && (
        <p className="green">
          {friendObj.name} owes you {Math.abs(friendObj.balance)}{" "}
        </p>
      )}
      {friendObj.balance === 0 && <p>you and {friendObj.name} are even </p>}
      <button className="button" onClick={() => onSelection(friendObj)}>
        {wasSelected ? "close" : "select"}
      </button>
    </li>
  );
}

function AddFriend() {
  const { setIsOpen, isOpen, onAddFriends } = useContext(FriendContext);
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !image) return null;
    const newFriend = {
      id: Date.now(),
      name,
      image,
      balance: 0,
    };
    onAddFriends(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
    setIsOpen(false);
  };
  return (
    isOpen && (
      <form className="form-add-friend" onSubmit={handleSubmit}>
        <label>👨🏿‍🤝‍👨🏽 friend name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
        />
        <label>🈚 image URL</label>
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          type="text"
        />
        <button className="button">Add</button>
      </form>
    )
  );
}

function SplitBill() {
  const { isSelected, onSplitBill } = useContext(FriendContext);
  const [bill, setBill] = useState("");
  const [paiedByUser, setPaiedByUser] = useState("");
  const userExpense = bill - paiedByUser;
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bill || !paiedByUser) return null;
    onSplitBill(whoIsPaying === "user" ? userExpense : -paiedByUser);
    setBill("");
    setPaiedByUser("");
    setWhoIsPaying("user");
  };

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>split a bill with {isSelected.name}</h2>
      <label>💰 bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🤦‍♂️ your expense</label>
      <input
        value={paiedByUser}
        onChange={(e) =>
          setPaiedByUser(
            Number(e.target.value) > bill ? paiedByUser : Number(e.target.value)
          )
        }
        type="text"
      />

      <label>{isSelected.name}'s expense</label>
      <input type="text" disabled value={userExpense} />

      <label>who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">you</option>
        <option value={isSelected.name}>{isSelected.name}</option>
      </select>

      <button class="button">splitt bill</button>
    </form>
  );
}
