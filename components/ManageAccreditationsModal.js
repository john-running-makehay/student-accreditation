"use client";

import { useState, useEffect } from "react";
import { fetchAccreditations } from "../utils/supabase";

export default function ManageAccreditationsModal({
  student,
  onAddAccreditation,
  onRemoveAccreditation,
  onClose,
}) {
  const [availableAccreditations, setAvailableAccreditations] = useState([]);
  const [selectedAccreditation, setSelectedAccreditation] = useState("");
  const [accreditedOn, setAccreditedOn] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch available accreditations on mount
  useEffect(() => {
    const fetchData = async () => {
      const accreditations = await fetchAccreditations();
      setAvailableAccreditations(accreditations);
    };

    fetchData();
  }, []);

  const handleAdd = () => {
    if (!selectedAccreditation || !accreditedOn) {
      alert("Please select an accreditation and set the date.");
      return;
    }

    // Call the parent handler for adding accreditation
    onAddAccreditation({
      studentId: student.id,
      accreditationId: selectedAccreditation,
      accreditedOn,
      notes,
    });

    // Reset form fields
    setSelectedAccreditation("");
    setAccreditedOn("");
    setNotes("");
  };

  const handleRemove = (accreditationId) => {
    // Call the parent handler for removing accreditation
    onRemoveAccreditation({ studentId: student.id, accreditationId });
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h2 className="text-lg font-bold mb-4">Manage Accreditations</h2>

        {/* Current Accreditations */}
        <h3 className="text-md mb-2 font-semibold">Current Accreditations</h3>
        {student.student_accreditations?.length > 0 ? (
          <ul className="list-disc list-inside mb-4">
            {student.student_accreditations.map((acc) => (
              <li
                key={acc.accreditation_id}
                className="flex justify-between items-center"
              >
                <span>
                  {acc.accreditations.degree} (Granted on: {acc.accredited_on})
                </span>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => handleRemove(acc.accreditation_id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4">
            No accreditations associated with this student.
          </p>
        )}

        {/* Add New Accreditation */}
        <h3 className="text-md mb-2 font-semibold">Add New Accreditation</h3>
        <div className="form-control mb-4">
          <label className="label">Select Accreditation</label>
          <select
            className="select select-bordered"
            value={selectedAccreditation}
            onChange={(e) => setSelectedAccreditation(e.target.value)}
          >
            <option value="">Select...</option>
            {availableAccreditations.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.degree}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control mb-4">
          <label className="label">Accredited On</label>
          <input
            type="date"
            className="input input-bordered"
            value={accreditedOn}
            onChange={(e) => setAccreditedOn(e.target.value)}
          />
        </div>
        <div className="form-control mb-4">
          <label className="label">Notes</label>
          <textarea
            className="textarea textarea-bordered"
            placeholder="Optional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        {/* Modal Actions */}
        <div className="modal-action">
          <button className="btn btn-primary" onClick={handleAdd}>
            Add Accreditation
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
