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
## v0.0.0
### New Features
* Implemented a UI flow from assignment screen to form screen and vice versa.
* Created a MySQL database and hosted it on AWS RDS.
* Created a Node.js backend to connect to the database and provide APIs for task retrievement, question retrieviement, and form submission.
### Bug Fixes
* The status of the task will be updated to "Completed" after the user finishes the form.
### Known Issues
* The user currently is not able to save the answers and review them later before submitting.
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
