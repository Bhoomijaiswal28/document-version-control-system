
# DocuFlow – Document Control & Version Management System

<p align="center">
  <strong>A Centralized Platform for Document Management, Version Tracking & Approval Workflows</strong>
</p>

---

## Overview

DocuFlow is a web-based document control and version management application designed to simplify document organization, tracking, and approval processes.

The platform provides a centralized dashboard to manage document uploads, maintain version history, monitor approval workflows, and track document-related activities.

## Key Features

- **Dashboard:** Centralized overview of document statistics and approval status.
- **Document Management:** Upload, organize, search, and manage documents.
- **Unique Document ID:** Assign unique identification numbers to documents.
- **Version Control:** Maintain multiple document versions under a single ID.
- **Approval Workflow:** Approve or reject submitted documents.
- **Document Preview:** Preview supported PDF and image files.
- **Version Tracking:** Access previous versions and compare document metadata.
- **Activity Logs:** Monitor document-related activities.
- **CSV Export:** Export activity records for reporting.
- **Local Storage:** Maintain data in the browser.

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application Structure |
| CSS3 | Styling and User Interface |
| JavaScript | Application Logic |
| Local Storage | Browser-Based Data Persistence |

## Project Structure

```text
docuflow_project/
│
├── index.html
├── style.css
└── script.js
```

## Installation & Setup

**1. Clone the Repository**

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

**2. Navigate to the Project Directory**

```bash
cd docuflow_project
```

**3. Open the Project**

Open the folder in Visual Studio Code.

**4. Run the Application**

Launch `index.html` using the Live Server extension.

## Document Versioning Example

| Document ID | Version | Description |
|---|---|---|
| DOC-001 | v1 | Initial Upload |
| DOC-001 | v2 | Updated Document |
| DOC-001 | v3 | Final Version |

Each document maintains a unique ID, allowing multiple versions to be associated with the same document record.

## Supported File Formats

- PDF
- DOC
- DOCX
- TXT
- PNG
- JPG / JPEG

**Maximum Upload Size:** 5 MB

## Future Enhancements

- Backend and database integration
- Secure user authentication
- Role-based access control
- Cloud document storage
- Advanced document comparison
- Automated approval notifications
- Detailed audit reporting

## Project Limitations

This version is a frontend prototype. Data is stored using browser Local Storage. Server-side storage, authentication, and multi-user collaboration are not currently implemented.

---

## Developer

**DocuFlow – Document Control & Version Management System**

*Designed to simplify document workflows through structured management and version tracking.*

---

<p align="center">
  If you find this project useful, consider giving it a ⭐
</p>
