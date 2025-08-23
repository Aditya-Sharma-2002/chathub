import { useState } from "react";
import "./CreateGroupModal.css";

export default function CreateGroupModal({ friends, isOpen, onClose, onCreate }) {
  const [step, setStep] = useState(1);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupDp, setGroupDp] = useState(null);

  const handleFriendSelect = (friendId) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSubmit = () => {
    onCreate({ groupName, groupDp, members: selectedFriends });
    onClose();
    setStep(1);
    setSelectedFriends([]);
    setGroupName("");
    setGroupDp(null);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal neumorphic">
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        {/* Step Container with slide effect */}
        <div className={`modal-content step-${step}`}>
          {/* Step 1: Friend Selection */}
          <div className="step step-1">
            <h2>Select Friends</h2>
            <div className="friends-list">
              {friends.map((friend) => (
                <label key={friend._id} className="friend-item">
                  <input
                    type="checkbox"
                    checked={selectedFriends.includes(friend._id)}
                    onChange={() => handleFriendSelect(friend._id)}
                  />
                  <img src={friend.profile} alt={friend.name} />
                  <span>{friend.name}</span>
                </label>
              ))}
            </div>
            <button
              disabled={selectedFriends.length === 0}
              onClick={() => setStep(2)}
              className="next-btn"
            >
              Next →
            </button>
          </div>

          {/* Step 2: Group Details */}
          <div className="step step-2">
            <h2>Group Details</h2>
            <input
              type="text"
              placeholder="Enter Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setGroupDp(e.target.files[0])}
            />
            <div className="actions">
              <button onClick={() => setStep(1)} className="back-btn">
                ← Back
              </button>
              <button
                disabled={!groupName}
                onClick={handleSubmit}
                className="create-btn"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
