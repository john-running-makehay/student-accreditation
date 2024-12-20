"use client";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import AddAccreditationModal from "../../components/AddAccreditationModal";
import EditAccreditationModal from "../../components/EditAccreditationModal";
import {
  fetchAccreditations,
  addAccreditation,
  updateAccreditation,
  deleteAccreditation,
} from "../../utils/supabase";

export default function AccreditationsPage() {
  const [accreditations, setAccreditations] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccreditation, setSelectedAccreditation] = useState(null);

  // Fetch accreditations on load
  useEffect(() => {
    const loadAccreditations = async () => {
      const data = await fetchAccreditations();
      setAccreditations(data);
    };

    loadAccreditations();
  }, []);

  // Add a new accreditation
  const handleAddAccreditation = async (newAccreditation) => {
    const addedAccreditation = await addAccreditation(newAccreditation);
    if (addedAccreditation) {
      setAccreditations((prev) => [...prev, addedAccreditation]);
      setShowAddModal(false);
    }
  };

  // Edit an accreditation
  const handleEditAccreditation = async (updatedAccreditation) => {
    const updated = await updateAccreditation(updatedAccreditation.id, {
      degree: updatedAccreditation.degree,
      description: updatedAccreditation.description,
    });
    if (updated) {
      setAccreditations((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
    }
  };

  // Delete a student with confirmation
  const handleDeleteStudent = async (id) => {
    // Display a toast asking for confirmation
    const confirmDelete = new Promise((resolve) => {
      toast(
        (t) => (
          <div>
            <p>Are you sure you want to delete this student?</p>
            <div className="mt-2 flex justify-end gap-2">
              <button
                className="btn btn-sm btn-error"
                onClick={() => {
                  resolve(true); // Confirm delete
                  toast.dismiss(t.id); // Close the toast
                }}
              >
                Yes, Delete
              </button>
              <button
                className="btn btn-sm"
                onClick={() => {
                  resolve(false); // Cancel delete
                  toast.dismiss(t.id); // Close the toast
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        { duration: Infinity } // Keep the toast until user responds
      );
    });

    // Wait for user confirmation
    const confirmed = await confirmDelete;
    if (!confirmed) return; // Exit if user cancels

    // Proceed to delete the student
    const success = await deleteStudent(id);
    if (success) {
      setStudents((prev) => prev.filter((student) => student.id !== id));
      toast.success("Student deleted successfully!");
    } else {
      toast.error("Failed to delete student. Please try again.");
    }
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-3xl font-bold mb-4">Accreditations</h1>

      {/* Add Accreditation Button */}
      <button
        className="btn btn-primary mb-4"
        onClick={() => setShowAddModal(true)}
      >
        Add Accreditation
      </button>

      {/* Accreditation Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Degree</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accreditations.map((item) => (
              <tr key={item.id}>
                <td>{item.degree}</td>
                <td>{item.description || "No description"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning mr-2"
                    onClick={() => {
                      setSelectedAccreditation(item);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDeleteAccreditation(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddAccreditationModal
          onAdd={handleAddAccreditation}
          onClose={() => setShowAddModal(false)}
        />
      )}
      {showEditModal && selectedAccreditation && (
        <EditAccreditationModal
          accreditation={selectedAccreditation}
          onEdit={handleEditAccreditation}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}
