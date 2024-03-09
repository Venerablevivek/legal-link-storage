# Decentralized Document Storage System with MERN Stack and Blockchain

## Overview

The project aims to create a decentralized document storage system using the MERN (MongoDB, Express.js, React.js, Node.js) stack along with blockchain technology. The system allows users to securely store their documents on the IPFS (InterPlanetary File System) storage system, ensuring immutability, transparency, and decentralization. Users can sign up, log in, upload documents, and share them with approved users. Documents are encrypted using bcrypt and SHA-256 algorithms for enhanced security. Users can request access to documents, and approvers can approve or reject these requests. Additionally, users receive email notifications when requesting access to documents. Approved documents are password-protected for other users' access.

## Features

- **User Signup and Login:** Users can create an account and log in securely.
- **Document Upload:** Users can upload their documents to the website.
- **Secure Document Storage:** Documents are securely stored on the IPFS storage system, ensuring decentralization and immutability.
- **Document Encryption:** Documents are encrypted using bcrypt and SHA-256 algorithms for enhanced security.
- **Document Sharing:** Users can share documents with approved users easily.
- **Request Access:** Users can request access to documents, and approvers can approve or reject these requests.
- **Email Notifications:** Users receive email notifications when requesting access to documents.
- **Password Protection:** Approved documents are password-protected for other users' access.

## Technologies Used

- **MERN Stack:** MongoDB for database, Express.js for backend, React.js for frontend, Node.js for server-side logic.
- **Blockchain:** Utilized for decentralized storage and immutability.
- **IPFS (InterPlanetary File System):** Used for secure document storage.
- **bcrypt and SHA-256:** Algorithms used for document encryption.
- **SMTP Protocol:** Used for sending email notifications.

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/your/repository.git
   ```

2. Install dependencies:

   ```
   cd client && npm install
   cd ../server && npm install
   ```

3. Set up MongoDB database and configure database connection in the server application.
4. Start the server:

   ```
   cd server && npm start
   ```

5. Start the client:

   ```
   cd client && npm start
   ```

## Usage

1. Sign up for an account or log in if you already have one.
2. Upload documents to the system.
3. Share documents with approved users.
4. Request access to documents from other users.
5. Approve or reject access requests as an approver.
6. Receive email notifications for access requests and document sharing.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for any suggestions or improvements.

## License

This project is licensed under the [MIT License](LICENSE).
