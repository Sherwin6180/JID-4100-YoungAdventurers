# BMED Peer Evaluation Application (Team 4100)

We are developing an app to improve the peer evaluation process requested by the BMED department at Georgia Tech. It provides two key functionalities: real-time evaluation and goal-based evaluation.
# Code Review Steps
### Step 1 - Pull From Repository
clone repository from github: 
```
git clone https://github.com/Sherwin6180/JID-4100-YoungAdventurers.git
```
### Step 2 - Create New Branch
First navigate to 4100-YoungAdventurers folder
check branches: 
```
git branch
```
create a new branch
```
git branch <branch-name>
```
If create new branch successfully, you will see two branches: *main and *<branch-name>
### Step 3 - Push Your Own Branch To Github Repository
```
git push origin <branch-name>
```
Now go to repository -> Branches -> Active Branches (your branch should be there)
### Step 4 - Fetch updates
Before you do coding on your own branch, make sure to fetch updates from others
Fetch main branch latest update
```
git fetch origin
```
Update main branch locally
```
git checkout main
git pull origin main
```
### Step 4 - Update Changes to Repository
First make sure you make changes on your own branch. After you make changes locally, following the steps below to update your changes.
Add all changing files
```
git add .
```
Add comments to your changes
```
git commit -m "YOUR COMMENTS HERE"
```
Push to your branch in the repository
```
git push origin <branch-name>
```
### Step 5 - Create a Pull Request
* Open repository
* Navigate to Pull Request -> click your own branch -> Create pull request
* On the right side, there is a "Reviewer" option. Clik it and choose people to review
* Write down some comments and click Create pull request
* Your reviewers should be able to see your pull request
### Step 6 - Review a Pull Request and Merge
* Navigate to Pull Requests and select the pull request assigned to you
* Click on the "Files changed" tab
* Examine all files and click on the "Review changes" button in green on the top right
* Make appropriate comments and submit
* Navigate back to the "Conversation" tab and merge the pull request

# Release Notes
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
### Known Issues
* If there is a space in the username during registration, it will result in successful registration but cannot login.
* On the page where the teacher user creates an assignment, the split between the assignment list and the create button is not clear enough.
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
### Known Issues
* Sliding the page causes unexpected returns.
* AWS crashes
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
### Known Issues
* Some page transitions are not visually smooth enough.
* AWS occasionally crashes.
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
### Known Issues
* User enters email and password without validating the formatting.
* No validation of multiple accounts tied to one email address.
* The situation where the updated password is identical to the original password has not been taken into consideration.
## v0.0.0
### New Features
* Implemented a UI flow from assignment screen to form screen and vice versa.
* Created a MySQL database and hosted it on AWS RDS.
* Created a Node.js backend to connect to the database and provide APIs for task retrievement, question retrieviement, and form submission.
### Bug Fixes
* The status of the task will be updated to "Completed" after the user finishes the form.
### Known Issues
* The user currently is not able to save the answers and review them later before submitting.

