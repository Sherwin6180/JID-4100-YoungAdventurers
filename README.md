# BMED Peer Evaluation Application (Team 4100)

We are developing an app to improve the peer evaluation process requested by the BMED department at Georgia Tech. It provides two key functionalities: real-time evaluation and goal-based evaluation.
# Release Notes
## v1.0
### Software Features
*
### Bug Fixes
* The status of the task will be updated to "Completed" after the user finishes the form.
* Previously passwords were stored in plaintext, now  they are encrypted.
* Improved password reset logic, allowing users to create unique security questions to ensure security.
* Previously roster view edit page was redirected from the dashboard, now it is redirected from the section detail page.
* The problem of screen misalignment has been solved.
* The issue of student users not being able to return to the dashboard after saving an unfinished assignment has been resolved.
* Page transitions are now visually smooth.
* The issue of teacher user cannot delete the question which is already been added.
* The issue of student can be added into several different groups at the same time.
  
* **Task Completion Update:** The task status will now automatically update to "Completed" after the user finishes the form.
* **Enhanced Password Security:** Passwords, which were previously stored in plaintext, are now securely encrypted.
* **Improved Password Reset Logic:** Users can now create unique security questions to enhance account security.
* **Roster View Navigation Update:** The Roster View Edit Page is now redirected from the Section Detail Page instead of the Dashboard.
* **Resolved UI Misalignment:** The issue causing screen misalignment has been fixed.
* **Assignment Save Issue Resolved:** Student users can now return to the dashboard after saving an unfinished assignment without any issues.
* **Smooth Page Transitions:** Page transitions have been visually improved for a smoother user experience.
* **Teacher Question Deletion Fix:** Teacher users can now delete previously added questions without encountering errors.
* **Group Assignment Issue Resolved:** Students can no longer be added to multiple groups simultaneously.
### Known Issues
* Depending on the phone model, the logout button may appear misaligned.
* Users are currently unable to modify their account security questions and answers.

## v0.4.0
### New Features
* Implemented the front-end UI for the student user group page.
* Implemented the front-end UI for the student user edit goal page.
* Implemented and modified the front-end UI for the student-to-do-assignment page.
* Implemented and modified the front-end UI for the teacher to set the goal evaluation question.
* Implemented and modified RESTful APIs for creating, posting, and finishing assignments.
* Implemented amd modified APIs to fetch all assignments for a specific student.
* Implemented APIs to fetch all group members for a group.
* Implemented APIs to create, edit and view the student goal.
* Connect student group page and teacher edit group page to the backend database.
### Bug Fixes
* The issue of teacher user cannot delete the question which is already been added.
* The issue of student can be added into several different groups at the same time.

## v0.3.0
### New Features
* Implemented the front-end UI for the student dashboard page.
* Implemented the front-end UI for the course assignment page.
* Implemented the front-end UI for the student-to-do-assignment page.
* Implemented the front-end UI for the teacher edit and post assignment page.
* Implemented RESTful APIs for creating, posting, and finishing assignments.
* Implemented APIs to fetch all assignments for a specific student.
* Connect student dashboard, course assignment, student do-assignment page, and teacher posting-assignment page to the backend database.
### Bug Fixes
* The issue of student users not being able to return to the dashboard after saving an unfinished assignment has been resolved.
* Page transitions are now visually smooth.

## v0.2.0
### New Features
* Implemented the front-end UI for the dashboard page.
* Implemented the front-end UI for the course edit page.
* Implemented the front-end UI for the section edit page.
* Implemented the front-end UI for the section detail page.
* Implemented the front-end UI for the roster view edit page.
* Implemented RESTful APIs for creating new classes and sections.
* Implemented APIs to fetch all students from database.
* Connect dashboard, course edit, section edit and roster view edit page to the backend database.
### Bug Fixes
* Previously roster view edit page was redirected from the dashboard, now it is redirected from the section detail page.
* The problem of screen misalignment has been solved.

## v0.1.0
### New Features
* Implemented the front-end UI for the user creation page.
* Implemented the front-end UI for the reset password page.
* Implemented the front-end UI for the user login page.
* Implemented the user table schema for database.
* Implemented RESTful APIs to allow for account creation.
* Connect user creation, reset password, and login page to the backend database.
### Bug Fixes
* Previously passwords were stored in plaintext, now  they are encrypted.
* Improved password reset logic, allowing users to create unique security questions to ensure security.

## v0.0.0
### New Features
* Implemented a UI flow from assignment screen to form screen and vice versa.
* Created a MySQL database and hosted it on AWS RDS.
* Created a Node.js backend to connect to the database and provide APIs for task retrievement, question retrieviement, and form submission.
### Bug Fixes
* The status of the task will be updated to "Completed" after the user finishes the form.

