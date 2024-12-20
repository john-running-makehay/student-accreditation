"use client";
import { useState, useEffect } from "react";

export default function AddEditStudentModal({
  student,
  onAdd,
  onEdit,
  onClose,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Populate the fields when editing an existing student
  useEffect(() => {
    if (student) {
      setName(student.name || "");
      setEmail(student.email || "");
    }
  }, [student]);

  const handleSubmit = () => {
    if (!name || !email) {
      alert("Name and email are required!");
      return;
    }

    if (student) {
      // Edit existing student
      onEdit({ ...student, name, email });
    } else {
      // Add new student
      onAdd({ name, email });
    }

    onClose(); // Close the modal after saving
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {student ? "Edit Student" : "Add Student"}
        </h3>
        <div className="form-control mb-4">
          <label className="label">Name</label>
          <input
            type="text"
            className="input input-bordered"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-control mb-4">
          <label className="label">Email</label>
          <input
            type="email"
            className="input input-bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="modal-action">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
