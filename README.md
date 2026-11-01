# DocuFlow
### Document Control & Version Management System

**A Centralized Platform for Document Organization, Version Tracking, and Approval Management.**

DocuFlow is a web-based document control application developed to streamline document management processes. It provides a structured environment for uploading, organizing, tracking document versions, and managing approval workflows through a centralized dashboard.

The system focuses on improving document traceability, maintaining version records, and simplifying document-related operations through an intuitive user interface.

## Overview

Managing multiple document versions and approval records manually can lead to inconsistencies, outdated files, and inefficient workflows.

DocuFlow addresses these challenges by providing a centralized interface where users can manage documents, maintain version history, review approval statuses, and monitor document-related activities.

## Core Capabilities

| Feature | Description |
|---|---|
| Dashboard | Centralized overview of document statistics and workflow status. |
| Document Management | Upload, organize, search, and access documents. |
| Document Identification | Assign unique identification numbers to documents. |
| Version Control | Maintain multiple versions under a single document ID. |
| Approval Management | Review, approve, or reject submitted documents. |
| Document Preview | Preview supported PDF and image formats. |
| Version Tracking | Access previous document versions and compare metadata. |
| Activity Logs | Track important document-related activities. |
| Data Export | Export activity records in CSV format. |

## Technology Stack

- **Frontend:** HTML5, CSS3
- **Programming Language:** JavaScript
- **Data Persistence:** Browser Local Storage
- **Development Environment:** Visual Studio Code

## Project Architecture

```text
docuflow_project/
│
├── index.html
├── style.css
└── script.js
```

- `index.html` – Defines the application structure and interface.
- `style.css` – Handles visual styling, layout, and responsiveness.
- `script.js` – Implements document operations, version tracking, approval workflows, and application logic.

## Getting Started

### Prerequisites
- A modern web browser.
- Visual Studio Code (recommended).
- Live Server extension (recommended).

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Navigate to the project directory:

   ```bash
   cd docuflow_project
   ```

3. Open the folder in Visual Studio Code.

4. Launch `index.html` using Live Server.

## Document Versioning Workflow

DocuFlow uses a unique Document ID to associate multiple versions of the same document.

**Example:**

| Document ID | Version | Description |
|---|---|---|
| DOC-001 | v1 | Initial document upload |
| DOC-001 | v2 | Revised document |
| DOC-001 | v3 | Final updated document |

This approach helps maintain document continuity and provides access to previous uploaded versions.

## Current Implementation

The current release is a frontend prototype demonstrating the core document management workflow.

- Browser-based data persistence using Local Storage.
- Supported document uploads: PDF, DOC, DOCX, TXT, PNG, JPG, and JPEG.
- Maximum upload size: 5 MB.
- Metadata-based version comparison and access to previous files.

**Implementation Note:** Server-side storage, authentication, role-based permissions, and multi-user collaboration are not included in the current version.

## Future Scope

- Backend and database integration.
- Secure user authentication and authorization.
- Role-based document access.
- Cloud storage integration.
- Advanced document content comparison.
- Automated approval notifications.
- Comprehensive audit and compliance reporting.

## Project Objective

To develop a structured and user-friendly document control solution that improves document organization, version traceability, and approval management while providing a foundation for future enterprise-level enhancements.

---

**DocuFlow | Document Control & Version Management System**