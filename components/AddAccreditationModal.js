"use client"; // Required for event handling
import { useState } from "react";

export default function AddAccreditationModal({ onAdd, onClose }) {
  const [newDegree, setNewDegree] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleSubmit = () => {
    if (!newDegree) {
      alert("Degree is required!");
      return;
    }
    onAdd({ degree: newDegree, description: newDescription });
    setNewDegree("");
    setNewDescription("");
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add New Accreditation</h3>
        <form className="mt-4">
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Degree</span>
            </label>
            <input
              type="text"
              placeholder="Enter degree"
              className="input input-bordered"
              value={newDegree}
              onChange={(e) => setNewDegree(e.target.value)}
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              placeholder="Enter description"
              className="textarea textarea-bordered"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>
        </form>
        <div className="modal-action">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
