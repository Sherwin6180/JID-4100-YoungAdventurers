# BMED Peer Evaluation Application (Team 4100)

We are developing an app to improve the peer evaluation process requested by the BMED department at Georgia Tech. It provides two key functionalities: real-time evaluation and goal-based evaluation.
# Code Review Steps
### Step 1 - Pull From Repository
clone repository from github: 
```
git clone https://github.com/Sherwin6180/JID-4100-YoungAdventurers.git
```
### Step 2 - Create New Branch
First naavigate to 4100-YoungAdventurers folder
check branches: 
```
git branch
```
create a new branch and navigate to that branch
```
git checkout branch <branch-name>
```
If create new branch successfully, you will see two branches: *main and *<branch-name>
```
git branch
```
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
Push to Repository
```
git push origin <branch-name>
```
# Release Notes
## v0.0.0
### Features
* Implemented a UI flow from assignment screen to form screen and vice versa.
* Created a MySQL database and hosted it on AWS RDS.
* Created a Node.js backend to connect to the database and provide APIs for task retrievement, question retrieviement, and form submission.
### Bug Fixes
* The status of the task will be updated to "Completed" after the user finishes the form.
### Known Issues
* The user currently is not able to save the answers and review them later before submitting.
