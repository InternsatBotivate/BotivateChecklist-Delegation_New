// dummyData.js — In-memory data store for the Checklist & Delegation application
// This file provides realistic mock data for all tables previously hosted on Supabase.

import { subDays, addDays, format } from "date-fns";

const today = new Date();
const fmt = (d) => format(d, "yyyy-MM-dd'T'HH:mm:ss");
const fmtDateOnly = (d) => format(d, "yyyy-MM-dd");

// ── USERS ──
export const users = [
  { id: 1, user_name: "admin", password: "admin123", email_id: "admin@taskdesk.com", number: "9999999999", employee_id: "EMP-001", role: "admin", status: "active", user_access: "all", department: "Management", Designation: "Super Admin", profile_image: null, can_self_assign: true },
  { id: 2, user_name: "Rahul", password: "rahul123", email_id: "rahul@taskdesk.com", number: "9888888888", employee_id: "EMP-002", role: "HOD", status: "active", user_access: "Operations,Maintenance", department: "Operations", Designation: "Operations Manager", profile_image: null, can_self_assign: true },
  { id: 3, user_name: "Priya", password: "priya123", email_id: "priya@taskdesk.com", number: "9777777777", employee_id: "EMP-003", role: "user", status: "active", user_access: "Operations", department: "Operations", Designation: "Executive", profile_image: null, can_self_assign: false, reported_by: "Rahul" },
  { id: 4, user_name: "Amit", password: "amit123", email_id: "amit@taskdesk.com", number: "9666666666", employee_id: "EMP-004", role: "user", status: "active", user_access: "Housekeeping", department: "Housekeeping", Designation: "Supervisor", profile_image: null, can_self_assign: false },
  { id: 5, user_name: "Sneha", password: "sneha123", email_id: "sneha@taskdesk.com", number: "9555555555", employee_id: "EMP-005", role: "user", status: "active", user_access: "Accounts", department: "Accounts", Designation: "Accountant", profile_image: null, can_self_assign: false },
  { id: 6, user_name: "Vikram", password: "vikram123", email_id: "vikram@taskdesk.com", number: "9444444444", employee_id: "EMP-006", role: "HOD", status: "active", user_access: "Maintenance,Repair", department: "Maintenance", Designation: "Maintenance Lead", profile_image: null, can_self_assign: true },
  { id: 7, user_name: "Neha", password: "neha123", email_id: "neha@taskdesk.com", number: "9333333333", employee_id: "EMP-007", role: "user", status: "active", user_access: "Reception", department: "Reception", Designation: "Receptionist", profile_image: null, can_self_assign: false },
  { id: 8, user_name: "Ravi", password: "ravi123", email_id: "ravi@taskdesk.com", number: "9222222222", employee_id: "EMP-008", role: "user", status: "on leave", user_access: "Security", department: "Security", Designation: "Security Guard", profile_image: null, can_self_assign: false, leave_date: fmtDateOnly(subDays(today, 1)), leave_end_date: fmtDateOnly(addDays(today, 2)), remark: "Personal emergency" },
];

// ── DEPARTMENTS ──
export const departments = [
  { id: 1, name: "Operations", given_by: "admin" },
  { id: 2, name: "Housekeeping", given_by: "admin" },
  { id: 3, name: "Maintenance", given_by: "admin" },
  { id: 4, name: "Reception", given_by: "admin" },
  { id: 5, name: "Accounts", given_by: "admin" },
  { id: 6, name: "Security", given_by: "admin" },
  { id: 7, name: "Repair", given_by: "admin" },
];

// ── ASSIGN FROM (given_by list) ──
export const assign_from = [
  { id: 1, name: "admin" },
  { id: 2, name: "Rahul" },
  { id: 3, name: "Vikram" },
  { id: 4, name: "Management" },
];

// ── CHECKLIST ──
export const checklist = [
  { task_id: 101, name: "Priya", department: "Operations", task_description: "Daily floor inspection", planned_date: fmt(today), status: "Pending", given_by: "Rahul", submission_date: null },
  { task_id: 102, name: "Amit", department: "Housekeeping", task_description: "Clean lobby area", planned_date: fmt(subDays(today, 1)), status: "Completed", given_by: "admin", submission_date: fmt(subDays(today, 1)) },
  { task_id: 103, name: "Priya", department: "Operations", task_description: "Stock inventory check", planned_date: fmt(subDays(today, 2)), status: "Overdue", given_by: "Rahul", submission_date: null },
  { task_id: 104, name: "Amit", department: "Housekeeping", task_description: "Washroom maintenance", planned_date: fmt(today), status: "Pending", given_by: "admin", submission_date: null },
  { task_id: 105, name: "Priya", department: "Operations", task_description: "Review safety protocols", planned_date: fmt(addDays(today, 1)), status: "Upcoming", given_by: "Rahul", submission_date: null },
];

// ── DELEGATION ──
export const delegation = [
  { task_id: 201, name: "Amit", task_description: "Organize office storage", planned_date: fmt(today), status: "pending", admin_done: false, given_by: "admin", submission_date: null },
  { task_id: 202, name: "Priya", task_description: "Draft quarterly report", planned_date: fmt(subDays(today, 3)), status: "done", admin_done: true, given_by: "Rahul", submission_date: fmt(subDays(today, 1)) },
  { task_id: 203, name: "Sneha", task_description: "Process monthly salary", planned_date: fmt(subDays(today, 5)), status: "done", admin_done: true, given_by: "admin", submission_date: fmt(subDays(today, 4)) },
];

// ── MAINTENANCE TASKS ──
export const maintenance_tasks = [
  { id: 301, name: "Vikram", department: "Maintenance", task_description: "Check HVAC system", planned_date: fmt(today), task_start_date: fmt(today), machine_name: "AC Unit 1", part_name: "Filter", part_area: "Roof", status: "Pending", given_by: "admin" },
  { id: 302, name: "Vikram", department: "Maintenance", task_description: "Generator oil change", planned_date: fmt(subDays(today, 7)), task_start_date: fmt(subDays(today, 7)), machine_name: "GenSet B", part_name: "Oil Filter", part_area: "Backyard", status: "Pending", given_by: "admin" },
];

// ── REPAIR TASKS ──
export const repair_tasks = [
  { id: 401, assigned_person: "Vikram", machine_name: "Water Pump", issue_description: "Leaking valve", status: "pending", filled_by: "Priya", created_at: fmt(subDays(today, 1)) },
  { id: 402, assigned_person: "Vikram", machine_name: "Elevator", issue_description: "Noisy operation", status: "pending", filled_by: "Neha", created_at: fmt(today) },
];

// ── EA TASKS ──
export const ea_tasks = [
  { id: 501, doer_name: "Sonali Dutta", task_description: "Book flight tickets for CEO", planned_date: fmt(today), task_start_date: fmt(today), status: "pending", given_by: "admin" },
  { id: 502, doer_name: "Sonali Dutta", task_description: "Schedule board meeting", planned_date: fmt(addDays(today, 2)), task_start_date: fmt(addDays(today, 2)), status: "pending", given_by: "admin" },
];

// ── HOLIDAYS ──
export const holidays = [
  { id: 1, holiday_name: "New Year", holiday_date: "2026-01-01" },
  { id: 2, holiday_name: "Republic Day", holiday_date: "2026-01-26" },
  { id: 3, holiday_name: "Independence Day", holiday_date: "2026-08-15" },
  { id: 4, holiday_name: "Gandhi Jayanti", holiday_date: "2026-10-02" },
  { id: 5, holiday_name: "Diwali", holiday_date: "2026-11-01" },
  { id: 6, holiday_name: "Christmas", holiday_date: "2026-12-25" },
];

// ── NOTIFICATIONS ──
export const notifications = [
  { id: 1, title: "New Task Assigned", message: "You have been assigned a new checklist task.", role_target: "all", created_by: 1, created_at: fmt(subDays(today, 1)) },
  { id: 2, title: "Task Overdue", message: "Task 'Check HVAC system' is overdue by 2 days.", role_target: "user", created_by: 1, created_at: fmt(today) },
  { id: 3, title: "Task Approved", message: "Your task 'Process monthly salary' has been approved.", role_target: "all", created_by: 1, created_at: fmt(subDays(today, 2)) },
  { id: 4, title: "New Delegation Task", message: "A new delegation task has been created for your team.", role_target: "admin", created_by: 1, created_at: fmt(today) },
];

// ── DROPDOWN OPTIONS (Schema compatible with CATEGORY_TO_COLUMN) ──
export const dropdown_options = [
  { id: 1, machine_name: "AC Unit 1" },
  { id: 2, machine_name: "GenSet B" },
  { id: 3, machine_name: "Water Pump" },
  { id: 4, machine_area: "Roof" },
  { id: 5, machine_area: "Backyard" },
  { id: 6, machine_area: "Basement" },
  { id: 7, part_name: "Filter", machine_name: "AC Unit 1" },
  { id: 8, part_name: "Oil Filter", machine_name: "GenSet B" },
  { id: 9, sound_test: "Yes" },
  { id: 10, sound_test: "No" },
  { id: 11, temperature: "Low" },
  { id: 12, temperature: "Medium" },
  { id: 13, temperature: "High" },
  { id: 14, task_priority: "Low" },
  { id: 15, task_priority: "Medium" },
  { id: 16, task_priority: "High" },
];

// ── WORKING DAY CALENDAR ──
// Seed a few months of working days
const seedWorkingDays = () => {
  const days = [];
  const start = subDays(today, 30);
  const end = addDays(today, 60);
  let current = start;
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0) { // Skip Sundays as non-working days
      days.push({ id: days.length + 1, working_date: fmtDateOnly(current) });
    }
    current = addDays(current, 1);
  }
  return days;
};

export const working_day_calender = seedWorkingDays();

// ── USER NOTIFICATIONS (read status tracking) ──
export const user_notifications = [];

// All tables map
export const ALL_TABLES = {
  users,
  departments,
  assign_from,
  checklist,
  delegation,
  maintenance_tasks,
  repair_tasks,
  ea_tasks,
  holidays,
  notifications,
  dropdown_options,
  working_day_calender,
  user_notifications,
};
