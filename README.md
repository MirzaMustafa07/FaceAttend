# FaceAttend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**FaceAttend** is an **offline mobile application** for **face recognition-based attendance management**. It allows educators to create classes, add students with photos, and automatically mark attendance using the device camera—**all without an internet connection**. Data is securely stored locally using **SQLite**.

---

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Future Improvements](#future-improvements)
- [Notes](#notes)
- [License](#license)

---

## Features

### 1. Create New Class
- Add class details:
  - Name
  - Venue
  - Date & Time (start and end, set via calendar and clock)
  - Lecturer Name
  - Subject
  - Branch, Year, Section
- Add students with details:
  - Name
  - Roll Number
  - Branch, Year, Section
  - Capture or upload a photo

### 2. Existing Classes
- View all previously created classes
- Edit class or student details if needed

### 3. Scan Class
- Open the camera to perform **face recognition**
- Mark attendance **only when a student’s face is recognized** (ensures authenticity)
- Generate detailed attendance reports including:
  - Student details
  - Class details
  - Date and time of attendance
- All data is saved locally using **SQLite**

### 4. Offline Functionality
- Fully functional **without internet**
- Data storage and retrieval are handled entirely on the device

---

## How It Works

1. **Create a Class**  
   Enter class information and add students with photos.

2. **Manage Classes**  
   Access existing classes to view or edit information.

3. **Mark Attendance**  
   Open the camera, recognize student faces, and mark attendance. The app ensures **students are only marked present when the face is detected**, preventing false entries.

4. **Reports**  
   Attendance reports can be generated and stored locally for review.

---

## Technology Stack

- **Platform:** Android / iOS (cross-platform possible with Flutter)
- **Database:** SQLite (local storage)
- **Face Recognition:** Offline face recognition library (e.g., OpenCV, ML Kit Face Detection)
- **Programming Language:** Dart (Flutter) / Kotlin / Java

---

## Installation

1. Clone the repository:  
```bash
git clone [(https://github.com/MirzaMustafa07/FaceAttend.git)]
