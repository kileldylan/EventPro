SHOW DATABASES;

CREATE DATABASE EventsInfo;

USE EventsInfo;

CREATE TABLE UserRoles (
    Role_ID INT PRIMARY KEY,
    Role_Name VARCHAR(50) NOT NULL
);

INSERT INTO UserRoles (Role_ID, Role_Name) 
VALUES
(1, 'Admin'),
(2, 'User');

CREATE TABLE Users (
    User_ID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Name VARCHAR(50) NOT NULL,
    Email VARCHAR(50) NOT NULL UNIQUE,
    Role_ID INT,
    ContactInfo VARCHAR(255) NOT NULL,
    FOREIGN KEY (Role_ID) REFERENCES UserRoles(Role_ID)
);

CREATE TABLE Venues (
    Venue_ID INT AUTO_INCREMENT PRIMARY KEY,
    Venue_Name VARCHAR(255),
    Street VARCHAR(255),
    City VARCHAR(255),
    District VARCHAR(255),
    State VARCHAR(255),
    Pincode VARCHAR(6),
    Capacity INT
);

CREATE TABLE Events (
    Event_ID INT AUTO_INCREMENT PRIMARY KEY,
    Event_Name VARCHAR(255),
    Event_Date VARCHAR(10),
    Event_Start_Time VARCHAR(10),
    Event_End_Time VARCHAR(10),
    Organizer VARCHAR(255),
    Tickets_Count INT,
    Ticket_Price INT,
    Available_Tickets INT,
    Venue_ID INT,
    FOREIGN KEY (Venue_ID) REFERENCES Venues(Venue_ID)
);

CREATE TABLE Tickets (
    Ticket_ID INT AUTO_INCREMENT PRIMARY KEY,
    Event_ID INT,
    User_ID INT NOT NULL,
    Purchase_Date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Quantity INT NOT NULL,
    Total_Price DECIMAL(10,2) NOT NULL,
    Status ENUM('Pending', 'Confirmed', 'Cancelled') NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (Event_ID) REFERENCES Events(Event_ID),
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID) ON DELETE CASCADE
);

CREATE TABLE Bookings (
    Booking_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT,
    Event_ID INT,
    Booking_Date DATE,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID),
    FOREIGN KEY (Event_ID) REFERENCES Events(Event_ID)
);

CREATE TABLE BookingDetails (
    BookingDetail_ID INT AUTO_INCREMENT PRIMARY KEY,
    Booking_ID INT,
    Ticket_ID INT,
    FOREIGN KEY (Booking_ID) REFERENCES Bookings(Booking_ID),
    FOREIGN KEY (Ticket_ID) REFERENCES Tickets(Ticket_ID)
);

CREATE TABLE Payments (
    Payment_ID INT AUTO_INCREMENT PRIMARY KEY,
    Booking_ID INT,
    Payment_Method VARCHAR(50),
    Amount DECIMAL(10, 2),
    Payment_Status VARCHAR(50),
    FOREIGN KEY (Booking_ID) REFERENCES Bookings(Booking_ID)
);

-- UPDATE Users
-- SET Role_ID = 1
-- WHERE Username = 'admin'
