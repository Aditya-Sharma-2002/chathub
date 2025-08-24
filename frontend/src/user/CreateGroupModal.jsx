import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./CreateGroupModal.css";

export default function CreateGroupModal({ friends = [], isOpen, onClose, onCreate }) {
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupDpFile, setGroupDpFile] = useState(null);
  const [groupDpPreview, setGroupDpPreview] = useState("");

  const overlayRef = useRef(null);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setQuery("");
      setSelected([]);
      setGroupName("");
      setGroupDpFile(null);
      setGroupDpPreview("");
    }
  }, [isOpen]);

  // Preview DP
  useEffect(() => {
    if (!groupDpFile) return setGroupDpPreview("");
    const url = URL.createObjectURL(groupDpFile);
    setGroupDpPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [groupDpFile]);

  // Filtered friends
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? friends.filter(f => 
          [f.name, f.username].some(v => v?.toLowerCase().includes(q))
        )
      : friends;
  }, [query, friends]);

  // Handlers
  const toggleSelect = (f) =>
    setSelected(prev =>
      prev.some(s => s._id === f._id)
        ? prev.filter(s => s._id !== f._id)
        : [...prev, f]
    );

  const handleCreate = () => {
    onCreate?.({
      groupName: groupName.trim(),
      groupDp: groupDpFile || null,
      members: selected.map(s => s._id),
    });
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="cg-overlay"
      onClick={(e) => e.target === overlayRef.current && onClose?.()}
    >
      <div className={`cg-modal ${step === 2 ? "shift" : ""}`}>
        <header className="cg-header">
          <h2>{step === 1 ? "Select Friends" : "Group Details"}</h2>
          <button className="cg-close" onClick={onClose}>×</button>
        </header>

        <div className="cg-slider">
          {/* STEP 1: Friends */}
          <section className="cg-step">
            <input
              className="cg-input"
              placeholder="Search friends…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="cg-list">
              {filtered.map(f => {
                const checked = selected.some(s => s._id === f._id);
                return (
                  <div
                    key={f._id}
                    className={`cg-item ${checked ? "checked" : ""}`}
                    onClick={() => toggleSelect(f)}
                  >
                    <img src={f.profile} alt={f.name} />
                    <div className="cg-user">
                      <span className="cg-name">{f.name}</span>
                      <span className="cg-username">@{f.username}</span>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="cg-empty">No friends found.</p>
              )}
            </div>
            <div className="cg-actions">
              <button className="cg-btn ghost" onClick={onClose}>Cancel</button>
              <button
                className="cg-btn primary"
                disabled={selected.length < 1}
                onClick={() => setStep(2)}
              >
                Next →
              </button>
            </div>
          </section>

          {/* STEP 2: Group Details */}
          <section className="cg-step">
            <input
              className="cg-input"
              placeholder="Group name…"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />

            <div className="cg-dropzone">
              {groupDpPreview ? (
                <img className="cg-preview" src={groupDpPreview} alt="Group DP" />
              ) : (
                <label className="cg-upload">
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => setGroupDpFile(e.target.files[0])}
                  />
                  Upload Group Image
                </label>
              )}
            </div>

            <div className="cg-actions">
              <button className="cg-btn ghost" onClick={() => setStep(1)}>← Back</button>
              <button
                className="cg-btn success"
                disabled={!groupName.trim()}
                onClick={handleCreate}
              >
                Create Group
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}