"use client";

import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import AddEditStudentModal from "../../components/AddEditStudentModal";
import ManageAccreditationsModal from "../../components/ManageAccreditationsModal";
import {
  fetchStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  associateAccreditation,
  removeAccreditation,
} from "../../utils/supabase";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch students on load
  useEffect(() => {
    const loadStudents = async () => {
      const data = await fetchStudents();
      const cleanedData = data.map((student) => ({
        ...student,
        student_accreditations: student.student_accreditations || [],
      }));
      setStudents(cleanedData);
    };

    loadStudents();
  }, []);

  // Add a new student
  const handleAddStudent = async (newStudent) => {
    const addedStudent = await addStudent({
      name: newStudent.name,
      email: newStudent.email,
    });

    if (addedStudent) {
      setStudents((prev) => [...prev, addedStudent]);
      toast.success("Student added successfully!");
    } else {
      toast.error("Failed to add student.");
    }

    setShowAddEditModal(false);
  };

  // Edit an existing student
  const handleEditStudent = async (updatedStudent) => {
    const editedStudent = await updateStudent(updatedStudent.id, {
      name: updatedStudent.name,
      email: updatedStudent.email,
    });

    if (editedStudent) {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === editedStudent.id
            ? {
                ...editedStudent,
                student_accreditations: student.student_accreditations, // Preserve accreditations
              }
            : student
        )
      );
      toast.success("Student updated successfully!");
    } else {
      toast.error("Failed to update student.");
    }

    setShowAddEditModal(false);
    setSelectedStudent(null);
  };

  // Delete a student with confirmation
  const handleDeleteStudent = async (id) => {
    const confirmDelete = new Promise((resolve) => {
      toast(
        (t) => (
          <div>
            <p>Are you sure you want to delete this student?</p>
            <div className="mt-2 flex justify-end gap-2">
              <button
                className="btn btn-sm btn-error"
                onClick={() => {
                  resolve(true);
                  toast.dismiss(t.id);
                }}
              >
                Yes, Delete
              </button>
              <button
                className="btn btn-sm"
                onClick={() => {
                  resolve(false);
                  toast.dismiss(t.id);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        { duration: Infinity }
      );
    });

    const confirmed = await confirmDelete;
    if (!confirmed) return;

    const success = await deleteStudent(id);
    if (success) {
      setStudents((prev) => prev.filter((student) => student.id !== id));
      toast.success("Student deleted successfully!");
    } else {
      toast.error("Failed to delete student.");
    }
  };

  // Add accreditation to a student
  const handleAddAccreditation = async ({
    studentId,
    accreditationId,
    accreditedOn,
    notes,
  }) => {
    try {
      const newAccreditation = await associateAccreditation(
        studentId,
        accreditationId,
        accreditedOn,
        notes
      );

      if (newAccreditation) {
        setStudents((prev) =>
          prev.map((student) =>
            student.id === studentId
              ? {
                  ...student,
                  student_accreditations: [
                    ...(student.student_accreditations || []),
                    newAccreditation,
                  ],
                }
              : student
          )
        );
        toast.success("Accreditation added successfully!");
      }
    } catch (error) {
      toast.error("Failed to add accreditation. Please try again.");
    }
  };

  // Remove accreditation from a student
  const handleRemoveAccreditation = async ({ studentId, accreditationId }) => {
    try {
      const success = await removeAccreditation(studentId, accreditationId);

      if (success) {
        setStudents((prev) =>
          prev.map((student) =>
            student.id === studentId
              ? {
                  ...student,
                  student_accreditations: student.student_accreditations.filter(
                    (acc) => acc.accreditation_id !== accreditationId
                  ),
                }
              : student
          )
        );
        toast.success("Accreditation removed successfully!");
      }
    } catch (error) {
      toast.error("Failed to remove accreditation. Please try again.");
    }
  };

  // Manage accreditations for a student
  const handleManageAccreditations = (student) => {
    setSelectedStudent(student);
    setShowManageModal(true);
  };

  return (
    <div className="p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-2xl font-bold mb-4">Students</h1>

      {/* Add Student Button */}
      <button
        className="btn btn-primary mb-4"
        onClick={() => {
          setSelectedStudent(null);
          setShowAddEditModal(true);
        }}
      >
        Add Student
      </button>

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Accreditations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>
                  <ul>
                    {student.student_accreditations?.length > 0 ? (
                      student.student_accreditations.map((acc) => (
                        <li key={acc.accreditation_id}>
                          {acc.accreditations?.degree || "No degree available"}{" "}
                          ({acc.accredited_on || "N/A"})
                        </li>
                      ))
                    ) : (
                      <li>No accreditations</li>
                    )}
                  </ul>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning mr-2"
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowAddEditModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-error mr-2"
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleManageAccreditations(student)}
                  >
                    Manage Accreditations
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showAddEditModal && (
        <AddEditStudentModal
          student={selectedStudent}
          onAdd={handleAddStudent}
          onEdit={handleEditStudent}
          onClose={() => {
            setShowAddEditModal(false);
            setSelectedStudent(null);
          }}
        />
      )}

      {showManageModal && (
        <ManageAccreditationsModal
          student={selectedStudent}
          onAddAccreditation={handleAddAccreditation}
          onRemoveAccreditation={handleRemoveAccreditation}
          onClose={() => setShowManageModal(false)}
        />
      )}
    </div>
  );
}
