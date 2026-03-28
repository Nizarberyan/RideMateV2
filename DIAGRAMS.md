# RideMate Architecture Diagrams

This file contains the system diagrams for RideMate. You can visualize these directly in VS Code (with the Mermaid extension), on GitHub, or by pasting the code into the [Mermaid Live Editor](https://mermaid.live/).

## 1. Use Case Diagram
Illustrates the interactions between users (Guests, Drivers, Passengers) and the system features.

```mermaid
useCaseDiagram
    actor "Guest" as G
    actor "User" as U
    actor "Passenger" as P
    actor "Driver" as D
    actor "System" as S

    U <|-- P
    U <|-- D

    package "Auth & Profile" {
        G --> (Register)
        G --> (Login)
        U --> (Manage Profile & Vehicle)
        U --> (Token Refresh)
    }

    package "Ride Management" {
        D --> (Offer Ride)
        (Offer Ride) ..> (Compute Route & Distance) : <<include>>
        D --> (Complete Ride)
        D --> (Cancel Ride)
        P --> (Search Rides by Radius/City)
    }

    package "Booking Lifecycle" {
        P --> (Request Booking)
        D --> (Confirm/Reject Booking)
        P --> (Cancel Booking)
        S --> (Restore Seats on Cancel) : <<trigger>>
    }

    package "Feedback & Safety" {
        U --> (Post Review)
        (Post Review) ..> (Update User Avg Rating) : <<include>>
        U --> (File Complaint)
        U --> (View Notifications)
    }

    package "Automated Services" {
        S --> (Send Push Notifications)
        (Compute Route & Distance) -- S
    }
```

## 2. Class Diagram
Represents the data models (Prisma) and the backend service logic (NestJS).

```mermaid
classDiagram
    %% Core Entities (Prisma Models)
    class User {
        +UUID id
        +string email
        +string password
        +Role role
        +float rating
        +float carbonSavedKg
        +string vehicleModel
        +float radius
        +string pushToken
    }

    class Ride {
        +UUID id
        +string startLocation
        +float startLat
        +float endLat
        +DateTime departureDatetime
        +int availableSeats
        +RideStatus status
        +float distanceKm
    }

    class Booking {
        +UUID id
        +int seatsBooked
        +BookingStatus status
        +string pickupLocation
        +boolean isRated
    }

    class Review {
        +UUID id
        +int rating
        +string comment
        +ReviewRole role
    }

    class Notification {
        +UUID id
        +string title
        +string message
        +boolean read
        +Json data
    }

    %% Backend Services (Logic Layer)
    class RidesService {
        +create(dto)
        +findAll(filters)
        +computeRoute(coords)
        +completeRide(id)
    }

    class BookingsService {
        +create(dto)
        +confirm(id)
        +reject(id)
        +restoreSeats(rideId)
    }

    class NotificationsService {
        +sendNotification(userId, title, msg)
        +markAsRead(id)
    }

    %% Relationships
    User "1" -- "*" Ride : drives
    User "1" -- "*" Booking : books
    User "1" -- "*" Notification : receives
    Ride "1" -- "*" Booking : has
    Booking "1" -- "0..2" Review : reviewed_by
    Booking "1" -- "*" Complaint : reported_in
    
    %% Service Dependencies
    RidesService ..> NotificationsService : triggers
    BookingsService ..> NotificationsService : triggers
    RidesService ..> Ride : manages
    BookingsService ..> Booking : manages
```
