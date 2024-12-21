//utils/supabase.js
import { supabase } from "../supabaseClient";

/**
 * Fetch all accreditations from Supabase.
 * @returns {Promise<Array>} - List of accreditations.
 */
export const fetchAccreditations = async () => {
  const { data, error } = await supabase.from("accreditations").select("*");
  if (error) {
    console.error("Error fetching accreditations:", error.message);
    return [];
  }
  return data;
};

/**
 * Add a new accreditation to Supabase.
 * @param {Object} accreditation - The accreditation to add.
 * @returns {Promise<Object|null>} - The newly added accreditation.
 */
export const addAccreditation = async (accreditation) => {
  const { data, error } = await supabase
    .from("accreditations")
    .insert([accreditation])
    .select();

  if (error) {
    console.error("Error adding accreditation:", error.message);
    return null;
  }
  return data[0];
};

/**
 * Update an existing accreditation in Supabase.
 * @param {string} id - The ID of the accreditation to update.
 * @param {Object} updates - The fields to update.
 * @returns {Promise<Object|null>} - The updated accreditation.
 */
export const updateAccreditation = async (id, updates) => {
  const { data, error } = await supabase
    .from("accreditations")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating accreditation:", error.message);
    return null;
  }
  return data[0];
};

/**
 * Delete an accreditation from Supabase.
 * @param {string} id - The ID of the accreditation to delete.
 * @returns {Promise<boolean>} - True if the deletion was successful.
 */
export const deleteAccreditation = async (id) => {
  const { error } = await supabase.from("accreditations").delete().eq("id", id);
  if (error) {
    console.error("Error deleting accreditation:", error.message);
    return false;
  }
  return true;
};

/**
 * Fetch all students with their associated accreditations.
 * @returns {Promise<Array>} - List of students with their accreditations.
 */
export const fetchStudents = async () => {
  const { data, error } = await supabase.from("students").select(`
        *,
        student_accreditations(
          accreditation_id,
          accredited_on,
          notes,
          accreditations(id, degree)
        )
      `);

  if (error) {
    console.error("Error fetching students:", error.message);
    return [];
  }
  return data;
};

/**
 * Add a new student to Supabase.
 * @param {Object} student - The student to add.
 * @returns {Promise<Object|null>} - The newly added student.
 */
export const addStudent = async (student) => {
  const { data, error } = await supabase
    .from("students")
    .insert([student])
    .select();

  if (error) {
    console.error("Error adding student:", error.message);
    return null;
  }
  return data[0];
};

/**
 * Update an existing student in Supabase.
 * @param {string} id - The ID of the student to update.
 * @param {Object} updates - The fields to update.
 * @returns {Promise<Object|null>} - The updated student.
 */
export const updateStudent = async (id, updates) => {
  const { data, error } = await supabase
    .from("students")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating student:", error.message);
    return null;
  }
  return data[0];
};

/**
 * Delete a student from Supabase.
 * @param {string} id - The ID of the student to delete.
 * @returns {Promise<boolean>} - True if the deletion was successful.
 */
export const deleteStudent = async (id) => {
  const { error } = await supabase.from("students").delete().eq("id", id);

  if (error) {
    console.error("Error deleting student:", error.message);
    return false;
  }

  return true;
};

/**
 * Associate an accreditation with a student.
 * @param {string} studentId - The student's ID.
 * @param {string} accreditationId - The accreditation's ID.
 * @param {string} accreditedOn - The date the accreditation was granted.
 * @param {string} notes - Additional notes about the accreditation.
 * @returns {Promise<Object|null>} - The new association.
 */
export const associateAccreditation = async (
  studentId,
  accreditationId,
  accreditedOn,
  notes
) => {
  const { data, error } = await supabase.from("student_accreditations").insert({
    student_id: studentId,
    accreditation_id: accreditationId,
    accredited_on: accreditedOn,
    notes,
  }).select(`
        id,
        student_id,
        accreditation_id,
        accredited_on,
        notes,
        accreditations (degree)
      `);

  if (error) {
    console.error("Error adding accreditation:", error);
    return null;
  }

  return data[0]; // Return the newly created accreditation
};

/**
 * Remove an accreditation from a student.
 * @param {string} studentId - The student's ID.
 * @param {string} accreditationId - The accreditation's ID.
 * @returns {Promise<boolean>} - True if successful.
 */
export const removeAccreditation = async (studentId, accreditationId) => {
  const { error } = await supabase
    .from("student_accreditations")
    .delete()
    .eq("student_id", studentId)
    .eq("accreditation_id", accreditationId);

  if (error) {
    console.error("Error removing accreditation:", error.message);
    return false;
  }
  return true;
};
