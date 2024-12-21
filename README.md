# Student Accreditation App

This repository contains a prototype for a Student Accreditation system. It allows you to manage students, accreditations, and their associations.

## Technologies Used

- Next.js 15
- React
- Supabase
- TailwindCSS
- DaisyUI
- React Hot Toast

## Features

- Manage students and accreditations.
- Associate accreditations with students.
- Cascading delete for accreditations and associated records.
- Real-time state updates.

## Setup and Installation

1.  **Clone the Repository**git clone [https://github.com/john-running-makehay/student-accreditation.git](https://github.com/john-running-makehay/student-accreditation.git)cd student-accreditation
2.  **Install Dependencies**npm install
3.  **Set up Environment Variables**Create a .env file in the project root with:NEXT_PUBLIC_SUPABASE_URL=your_supabase_urlNEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
4.  **Run the Application**npm run devAccess the app at [http://localhost:3000](http://localhost:3000)

## Database Setup

\-- Accreditations Tablecreate table public.accreditations (id uuid not null default gen_random_uuid (),degree text not null,description text null,created_at timestamp null default now(),constraint accreditations_pkey primary key (id),constraint accreditations_degree_key unique (degree));

\-- Student Accreditations Tablecreate table public.student_accreditations (id uuid not null default gen_random_uuid (),student_id uuid null,accreditation_id uuid null,accredited_on date not null,notes text null,created_at timestamp null default now(),constraint student_accreditations_pkey primary key (id),foreign key (accreditation_id) references accreditations (id) on delete cascade,foreign key (student_id) references students (id) on delete cascade);

\-- Students Tablecreate table public.students (id uuid not null default gen_random_uuid (),name text not null,email text not null,created_at timestamp null default now(),constraint students_pkey primary key (id));
