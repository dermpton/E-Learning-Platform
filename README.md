# E-Learning-Platform

A mock version of Google Classroom, that emphasizes local storage and JWT authorization.

## Description

The E-Learning Platform provides an opportunity for students to partake in distance learning,
students are not limited to their universities courses can instead register for any course of their choice, provided they have a valid course code. However depending on the instructor, the issuing of the course code may require compensation, the E-Learning Platform holds no part in this. Students and teacher alike can become tutors or instructors free of charge and teacher their own lessons. Storage is geared at an individuals device, and is dependent on how much disk storage is available.

## Installation

I present a two-step approach, as the license suggests any and all individuals are free to access the source code alter and do what they deem necessary, with the exception of the images that are subject to copyright under their respective owners.

1. A deployed instance should be provided in the near future!
2. Clone the repository using your favorite terminal and code editor, run the npm install once inside and finally run the npm start command to view it in localhost.

## Usage

Example (Student):

1. Ensure you are a registered user, head over to sign up to get started!
2. Attain a valid course code from a trusted source, the instructor. Each course code is unique to your student ID hence sharing the same course code is not feasible.
3. Login to your account and click the '+' button to join a class/course, enter the given course code mention in (2.).
4. A push notification should inform you on your success (or failure) of the course code validation. Refresh your page and click 'home' button to view your course overview.
5. Entering a class/course requires you to click the class itself, a leave option has been provided too.
6. Start Learning!

Example (Instructor/Tutor/Admin):

1. Enter the Admin portal and enter your credentials whether signing up/logging in the procedure remains intuitive.
2. An admins dashboard should greet you with a plain canvas and empty logs, to generate a class code is done by adding a course, listed in your overview, bind each course code with the recipient and it shall hash the course code to the student Id provided in by context.
3. Monitor and create new posts, new assignments and new lecture notes to provide to your students.

NB: There is NO virtual drive like Google Drive, your files are stored on Disk Storage of device hence to optimize speed reduce the size as suggested.

# Author/Maintainer Information

dermpton.

## Technologies Used

MongoDB, Express.js, Node.js, Handle-bars3 as the templating Engine

# License

MIT License

Copyright (c) 2025 dermpton

Lasted Modified: Wednesday, 12 March 2025 06:05 AM CAT