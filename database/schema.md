# UniBolt ERP — Database Schema

## Overview
UniBolt ERP uses Firebase Firestore (NoSQL document database).
Each section below describes a Firestore collection.

---

## Collections

### `users`
Main user profiles. One document per user (uid = Firestore doc ID).

### `students`
Extended student records (linked to users via userId).

### `faculty`
Extended faculty records (linked to users via userId).

### `courses`
Course/subject definitions.

### `attendance`
Attendance records per student per subject per date.

### `results`
Exam result records.

### `fees`
Fee records per student per semester.

### `payments`
Payment transactions.

### `books` / `bookIssues`
Library catalog and issue/return tracking.

### `hostelRooms` / `hostelAllocations`
Hostel room inventory and student allocations.

### `transportRoutes` / `vehicles`
Transport route and vehicle management.

### `notifications`
In-app notifications per user.

### `announcements`
Campus-wide announcements.

### `events`
Events calendar.

### `tickets`
Support helpdesk tickets.

### `auditLogs`
Immutable system audit trail.

### `jobs` / `internships`
Placement listings.

### `timetables`
Class timetable entries.

### `leaveRequests`
Faculty/staff leave requests.

---

See `collections/*.json` for sample data structures.
