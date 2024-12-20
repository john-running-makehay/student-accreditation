"use client"; // Required for event handling
import { useState } from "react";

export default function EditAccreditationModal({
  accreditation,
  onEdit,
  onClose,
}) {
  const [degree, setDegree] = useState(accreditation.degree);
  const [description, setDescription] = useState(accreditation.description);

  const handleSubmit = () => {
    if (!degree) {
      alert("Degree is required!");
      return;
    }
    onEdit({ id: accreditation.id, degree, description });
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit Accreditation</h3>
        <form className="mt-4">
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Degree</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </form>
        <div className="modal-action">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
