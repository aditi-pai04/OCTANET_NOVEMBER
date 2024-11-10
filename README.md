# Document Editor with Role-based Access Control

This is a document editing application that allows users to create, edit, and share documents with role-based access control. Users can have different roles: **Owner**, **Editor**, or **Viewer**. Based on their role, they will have different levels of access to the document. **Owners** and **Editors** can edit the document, while **Viewers** can only view it.

## Features
- **Role-based Access Control**: 
  - **Owner**: Can edit content, rename the document, and change sharing settings.
  - **Editor**: Can edit content but cannot rename the document or change sharing settings.
  - **Viewer**: Can only view the document content.
- **Real-time Collaboration**: Changes made by any editor or owner are reflected instantly for all users viewing the document.
- **Sharing Options**:
  - **Public Sharing**: Owners can share the document publicly, allowing anyone to view and edit it.
  - **Private Sharing**: Owners and editors can share the document with specific email addresses.
  
## Prerequisites

- Node.js and npm installed.
- A backend API that handles document CRUD operations and user roles (e.g., using Express.js, MongoDB, etc.).
- Socket.io for real-time collaboration.
- A database setup to store user roles, document content, and sharing settings.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aditi-pai04/DocSync.git
   cd docsync
