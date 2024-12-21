Student Accreditation App
This repository contains a prototype for a Student Accreditation system. It allows you to manage students, accreditations, and their associations. The project is built with modern web technologies and designed for ease of setup and deployment.

Technologies Used
Next.js 15: A React framework for production.
React: JavaScript library for building user interfaces.
Supabase: Backend-as-a-service for managing databases and authentication.
TailwindCSS: Utility-first CSS framework for styling.
DaisyUI: TailwindCSS-based component library.
React Hot Toast: For elegant notifications.
Features
Manage students and accreditations through an intuitive UI.
Associate accreditations with students.
Cascading delete functionality for accreditations and associated records.
Real-time state updates for added/removed accreditations.
Setup and Installation

1. Clone the Repository
   Clone the repository and navigate to the project directory:

git clone https://github.com/john-running-makehay/student-accreditation.git
cd student-accreditation

2. Install Dependencies
   Install the required packages by running:

npm install

3. Set up Environment Variables
   Create a .env file in the root of the project.
   Add the following lines to your .env file:
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

Replace your_supabase_url and your_supabase_anon_key with the corresponding values from your Supabase project's API settings. 4. Run the Application
Start the development server:

npm run dev

Access the application at http://localhost:3000.

Database Setup

1. Accreditations Table
   Create the accreditations table:

create table public.accreditations (
id uuid not null default gen_random_uuid (),
degree text not null,
description text null,
created_at timestamp without time zone null default now(),
constraint accreditations_pkey primary key (id),
constraint accreditations_degree_key unique (degree)
);

2. Student Accreditations Table
   Create the student_accreditations table:

create table public.student_accreditations (
id uuid not null default gen_random_uuid (),
student_id uuid null,
accreditation_id uuid null,
accredited_on date not null,
notes text null,
created_at timestamp without time zone null default now(),
constraint student_accreditations_pkey primary key (id),
constraint student_accreditations_accreditation_id_fkey foreign key (accreditation_id) references accreditations (id) on delete cascade,
constraint student_accreditations_student_id_fkey foreign key (student_id) references students (id) on delete cascade
);

3. Students Table
   Create the students table:

create table public.students (
id uuid not null default gen_random_uuid (),
name text not null,
email text not null,
created_at timestamp without time zone null default now(),
constraint students_pkey primary key (id)
);

Suggested Next Steps
Add Authentication using Supabase's Auth features.
Implement Row Level Security on tables to control data access effectively. (Requires authentication to be set up first.)
Refactor the code to separate concerns and ensure cleaner architecture.
