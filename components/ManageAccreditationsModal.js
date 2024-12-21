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
  const [localAccreditations, setLocalAccreditations] = useState(
    student.student_accreditations || []
  ); // Local copy of student accreditations
  const [selectedAccreditation, setSelectedAccreditation] = useState("");
  const [accreditedOn, setAccreditedOn] = useState("");
  const [notes, setNotes] = useState("");

  // Sync local accreditations whenever the modal receives new student data
  useEffect(() => {
    setLocalAccreditations(student.student_accreditations || []);
  }, [student]);

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

    const newAccreditation = {
      accreditation_id: selectedAccreditation,
      accredited_on: accreditedOn,
      notes,
      accreditations: availableAccreditations.find(
        (acc) => acc.id === selectedAccreditation
      ),
    };

    // Call the parent handler for adding accreditation
    onAddAccreditation({
      studentId: student.id,
      accreditationId: selectedAccreditation,
      accreditedOn,
      notes,
    });

    // Update local accreditations state
    setLocalAccreditations((prev) => [...prev, newAccreditation]);

    // Reset form fields
    setSelectedAccreditation("");
    setAccreditedOn("");
    setNotes("");
  };

  const handleRemove = (accreditationId) => {
    // Call the parent handler for removing accreditation
    onRemoveAccreditation({ studentId: student.id, accreditationId });

    // Update local accreditations state
    setLocalAccreditations((prev) =>
      prev.filter((acc) => acc.accreditation_id !== accreditationId)
    );
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h2 className="text-lg font-bold mb-4">Manage Accreditations</h2>

        {/* Current Accreditations */}
        <h3 className="text-md mb-2 font-semibold">Current Accreditations</h3>
        {localAccreditations.length > 0 ? (
          <ul className="list-disc list-inside mb-4">
            {localAccreditations.map((acc) => (
              <li
                key={acc.accreditation_id}
                className="flex justify-between items-center"
              >
                <span>
                  {acc.accreditations?.degree || "No degree"} (Granted on:{" "}
                  {acc.accredited_on || "N/A"})
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
