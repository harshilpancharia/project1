The NextHope initiative is a step towards contributing to reduce poverty in india and reduce the number of beggars in our nation by providing a bridge between clients and beggars.

Details:---------------
3 Nodes--> Client; Volunteer; Beggar


Steps-:
- Volunteer and Clients has to register on website and complete the required KYC.
- Volunteers registers beggars in person on the website with their KYC details.
- Client can post manpower requirement on the website and the volunteers can generously approach beggars for the work.


The website is under-construction. 🚧🚧


# Project Dependencies

This project utilizes the following dependencies:

## Node.js Modules

Install these modules using `npm install`:
`npm install express cloudinary mysql2 express-fileupload`:

# Modules
express==4.17.1  # Or your specific version
cloudinary==1.37.3 # Or your specific version
mysql2==3.9.1 # Or your specific version
express-fileupload==1.4.3 # Or your specific version

# CDNs (for front-end assets)
# Bootstrap CSS
https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css

# jQuery
https://code.jquery.com/jquery-3.7.1.min.js

# Bootstrap JavaScript Bundle
https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js

# Assets (static files)
# These are referenced by your express.static("public") call.
# Therefore, they should be located in the "public" folder.

# Example:
# public/style.css (if you have a CSS file)
# public/script.js (if you have a JavaScript file)
# public/images/logo.png (if you have an image)
# public/uploads/ (Folder for uploaded files)

# pages/index.html (Your index file)
# pages/vol-dash.html (Volunteer dashboard page)
# pages/vol-kyc.html (Volunteer KYC page)

# Database Configuration (NOT part of requirements.txt, but important)
# Your database configuration details (dbConfig) should be stored securely and not included in this file.
# These details include:
# - Host
# - User
# - Password
# - Database name
# - Connection details

# Cloudinary Configuration (NOT part of requirements.txt, but important)
# Your Cloudinary configuration details (cloud_name, api_key, api_secret) should be stored securely and not included in this file.


nexthope_site/
├── .git/
│   └── ... (Git repository files)
├── node_modules/
│   ├── ... (npm packages)
├── pages/
│   ├── index.html    (Main/Home page)
│   ├── vol-dash.html (Volunteer dashboard)
│   ├── vol-kyc.html  (Volunteer KYC form)
├── public/
│   ├── style.css    (Optional: CSS files)
│   ├── script.js     (Optional: JavaScript files)
│   ├── images/      (Optional: Image assets)
│   ├── uploads/     (Folder for uploaded files)
├── package.json
│   └── ... (Project metadata, dependencies, scripts)
├── package-lock.json
│   └── ... (Exact dependency versions)
├── server.js
│   └── ... (Main server-side application file)
└── README.md
└── ... (This file)
