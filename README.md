# Theme Park Ticket Booking System

A microservices-based ticket booking system for theme parks, designed to allow users to book tickets for park entry efficiently. This project leverages modern architectural patterns, message queues, and cloud technologies to ensure scalability, independence, and reliability.

## Project Overview

This project follows a **microservices architecture** to modularize functionality, enhance scalability, and improve fault tolerance. Each service is independently deployable and communicates via HTTP (Axios) or message queues (RabbitMQ). Below are the key services and their roles:

### Microservices

1. **ThemeParkAndSearch**

   - **Purpose**: Manages theme park details (e.g., location, names, timings).
   - **Status**: These are just the dummy data to showcase the functionality.
   - **Database**: `theme_park_db_dev` (MySQL with Sequelize ORM).
     - **Tables**: `cities`, `parks`, `parktimings`.
     - **Relationships**:
       - `Cities` → `Parks` (1:N): One city can have many parks.
       - `Parks` → `ParkTimings` (1:N): One park can have multiple timings (e.g., weekdays: 10 AM–5 PM, weekends: 8 AM–5 PM).
   - **Features**: CRUD operations, elegant error handling.

2. **ThemeParkAuthService**

   - **Purpose**: Handles user authentication, profile creation, and management.
   - **Status**: Fully implemented with a React frontend for signup, login, and profile management.
   - **Database**: `Theme_park_auth_db` (MongoDB).
     - **Collections**: `users`, `roles`.
     - **Relationships**: Each `user` document references a `role` (e.g., customer, admin), managed via MongoDB references or embedded documents.
   - **Features**:
     - Profile photo upload using `multer`.
     - Integration with Hugging Face API, OpenAI API to generate profile pictures, showcasing adaptability to modern tech trends.
     - Elegant error handling.

3. **TicketBookingService**

   - **Purpose**: Manages ticket booking for theme parks.
   - **Status**: Fully implemented.
   - **Database**: `themepark_booking_db_dev` (MySQL).
     - **Tables**: `bookings`, `ticketpassengers`, `ticketprices`, `tickets`, `daily_capacity_usage` (for future optimization).
     - **Relationships**:
       - `Ticket` → `Bookings` (1:N).
       - `Booking` → `TicketPassengers` (1:N).
       - `TicketPrices` → `Park` (1:1).
   - **Features**:
     - Family discount: 10% off `child_price` if `number_of_children >= 2`, with original price preserved in response.
     - Dependencies: `ThemeParkAndSearch` (park validation) and `ThemeParkAuthService` (user verification) via Axios.
     - Message queue (RabbitMQ) integration to decouple from `ThemeParkReminderService`.
     - Elegant error handling.

4. **ThemeParkReminderService**

   - **Purpose**: Sends email reminders for bookings.
   - **Status**: Fully implemented.
   - **Database**: `themepark_reminder_db_dev` (MySQL).
     - **Tables**: `notifications`.
   - **Features**:
     - Two reminder types:
       1. Booking confirmation (checked every 2 minutes via cron).
       2. Visit date reminder (sent at 6:00 AM on `visit_date` via cron).
     - RabbitMQ message queue to ensure independence from `TicketBookingService`.
     - Prevents bottlenecks and ensures functionality even if the service is down.
     - Elegant error handling.

5. **ThemePark_API_Gateway**

   - **Purpose**: Central entry point for client requests, providing rate limiting, authentication, and request routing.
   - **Status**: Fully implemented.
   - **Features**:
     - Rate limiting with `express-rate-limit` to prevent DDoS and brute-force attacks.
     - Authentication via `ThemeParkAuthService`.
     - Request proxying to microservices using `http-proxy-middleware`.
     - Logging with `morgan`.
     - Elegant error handling.
   - **Why Separate Gateway?**: Avoids duplicating rate-limiting logic in each microservice, keeping them focused on core logic.

6. **ThemeParkAdminService**

   - **Purpose**: Admin management (e.g., park updates, user oversight).
   - **Status**: Not yet implemented (planned).

7. **ThemeParkPaymentService**
   - **Purpose**: Payment processing for bookings.
   - **Status**: Not yet implemented (planned).

## Additional Features

- **AWS Deployment**: Hosted `TicketBookingService` on an AWS EC2 instance with an auto-scaling load balancer (later decommissioned due to account ownership).
- **Tech Stack**:
  - Backend: Node.js, Express, Sequelize (MySQL ORM), Mongoose (MongoDB ORM).
  - Frontend: React (for `ThemeParkAuthService`).
  - Messaging: RabbitMQ.
  - Gateway: Express with `http-proxy-middleware`, `express-rate-limit`, `morgan`.
  - APIs: Axios, Hugging Face API, OpenAI API.

## Architecture Highlights

- **Microservices**: Independent services with dedicated databases (MySQL and MongoDB).
- **Decoupling**: RabbitMQ ensures `TicketBookingService` operates independently of `ThemeParkReminderService`.
- **Scalability**: API Gateway with rate limiting and load balancing (AWS demo).
- **Error Handling**: Consistent and elegant across all services.

## Future Enhancements

- Implement `ThemeParkAdminService` and `ThemeParkPaymentService`.
- Add retry logic for failed notifications.
- Optimize `daily_capacity_usage` for capacity management.

## Setup Instructions

1. Clone the repository: `git clone <repo-url>`.
2. Install dependencies: `npm install` in each service directory.
3. Configure environment variables (e.g., `serverConfig.js` with database URLs, RabbitMQ URL).
4. Run services: `npm start` in each service folder.
5. Ensure RabbitMQ, MySQL, and MongoDB are running locally or via cloud providers.
