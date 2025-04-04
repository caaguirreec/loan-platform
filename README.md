# Loan Platform

A SaaS platform for small companies to allow their employees to access loans.

## Architecture

The application is built with three main components:

1. **Frontend**: React with Vite and Tailwind CSS
2. **Backend**: Python Flask RESTful API
3. **Database**: SQLite

All components are containerized with Docker and orchestrated with Docker Compose.

## Features

- Role-based access (Employee and Company)
- Employees can request loans by specifying an amount and term
- Companies can view all loan requests and approve/deny them
- Modern UI with responsive design

## Getting Started

### Prerequisites

- Docker and Docker Compose installed

### Running the Application

1. Clone the repository
2. Navigate to the project directory
3. Run the application with Docker Compose:

```bash
docker-compose up
```

4. Access the application in your browser at http://localhost:3000

## Using the Application

### As an Employee

1. Select "Employee" from the landing page
2. Fill out the loan request form with your name, amount, and term
3. Submit the form

### As a Company

1. Select "Company" from the landing page
2. View all loan requests in a table
3. Approve or deny pending loan requests

## Development

To make changes to the application:

1. Frontend code is in the `frontend` directory
2. Backend code is in the `backend` directory
3. Database files are stored in the `database` directory

Any changes to the code will be automatically reflected in the running application due to the volume mounts configured in Docker Compose. 
