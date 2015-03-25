# Do Things!
a to-do list

This is a simple To-Do list with a React frontend and a Flask backend. Install locally by cloning the repository and setting up a virtual environment with the appropriate versions of Python and Flask (see `app/requirements.txt` and `app/runtime.txt`).

This is **not** a production-ready app. The following aspects would need improvement for this to be deployed:
* The Data module (`app/data.py`) just uses local memory to store user data, so it won't persist if the server gets restarted.
* There is no proper user authentication taking place in this version of the app. Instead, the app just writes a plain-text (unencrypted) user ID on the user's cookie and uses that to identify the user.
* Further unit testing and error handling would be required to make sure that malicious, or even accidental, faulty client requests wouldn't crash the back-end (and preferably not the front-end, either).
