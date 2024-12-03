# Install Guide
## Pre-requisites
* Make sure you have NodeJS and npm installed on your machine. Check the [official documentation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) for more details.
* Make sure you have MySQL Workbench and MySQL Server installed on your machine. These tutorials might help:
    * [Install MySQL Workbench on Windows](https://www.geeksforgeeks.org/how-to-install-sql-workbench-for-mysql-on-windows/)
    * [Install MySQL Server on Windows](https://www.geeksforgeeks.org/how-to-install-mysql-in-windows/)
    * [Install MySQL Workbench on MacOS](https://www.geeksforgeeks.org/how-to-install-mysql-workbench-on-macos/)
    * [Install MySQL Server on MacOS](https://www.geeksforgeeks.org/how-to-install-mysql-on-macos/)
## Download (Clone) the repository
`git clone https://github.com/Sherwin6180/JID-4100-YoungAdventurers.git`
## Install dependent libraries
First navigate to `/frontend`, then run `npm install` to install libraries for the frontend.
Then navigate to `/backend` and run `npm install` to install libraries for the backend.
## Configure the project
### Configure the IP address
This step will defines the url of the backend server to be used by the frontend.
1. Get the IP address of your machine
2. navigate to `/frontend/config.js`
3. Replace the current IP address with yours but keep the port number 3000. It will look like `apiUrl: "http://{YOUR_IP_ADDRESS_HERE}:3000"`
### Configure the database 
When you have MySQL server set up on your machine, take a note on the host name, port number, user name, and password
1. Make sure your MySQL server is running.
2. Navigate to `/backend/db.sql`, copy the whole content and paste it in MySQL Workbench, then run the SQL script.
3. If it runs successfully, you will see a new database called "evaluation" is created.
4. Navigate to `/backend/db.js`, change the host, port, user, and password if they are different. Ideally, you only need to change the password.
## Run the project
### Run the frontend
Navigate to `/frontend`, and run `npm start`.
### Run the backend
Navigate to `/backend`, and run `node app.js`.
## Troubleshooting
1. Running commands don't work
As far as we know, the bcrypt library in the backend sometimes will break the compilation. In this case, try first run `npm uninstall bcrypt` and then `npm install bcrypt`.
2. Deprecated libraries
Use `npm update {library-name}` to update outdated libraries.
3. Expo out of date
Occasionally, the Expo will have new updates and may not work well with mobile Expo App. In this case, you might want to run `npx expo install expo@^{version_number}` or `npx expo install expo@latest` to get the latest support.
4. Backend is not working / Cannot connect to backend
Make sure you configured your IP address as mentioned above.