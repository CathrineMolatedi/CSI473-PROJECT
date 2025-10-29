# Neighborhood Watch Member Patrol System

## Overview
The Neighborhood Watch Member Patrol System is a web application designed to enhance community safety by enabling neighborhood watch members and security officers to communicate effectively, report incidents, and manage patrol activities. The application provides various features for users, including authentication, dashboards, and a community forum.

## Features
- **User Authentication**: Secure login and registration for neighborhood watch members, security officers, and administrators.
- **Dashboards**: Role-specific dashboards for residents, officers, and administrators to manage their activities and view relevant information.
- **Community Forum**: A platform for users to create posts, reply to others, and engage in discussions.
- **QR Code Scanner**: A feature for security officers to scan QR codes during patrols for verification and reporting.
- **Two-Factor Authentication**: Enhanced security for administrators during the login process.
- **Notifications**: Real-time notifications via SMS, email, and in-app alerts for important updates and alerts.
- **Geolocation Services**: Retrieve and display user locations for better situational awareness.
- **Offline Sync**: Manage data storage and synchronization when the application is offline.

## Project Structure
```
neighborhood-watch-member-patrol-system
├── public
│   └── index.html
├── src
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── components
│   │   ├── ForumComponent.tsx
│   │   ├── Scanner.tsx
│   │   ├── TwoFactorAuth.tsx
│   │   ├── ImageWithFallback.tsx
│   │   └── ui
│   │       ├── accordion.tsx
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── modal.tsx
│   │       ├── table.tsx
│   │       └── utils.ts
│   ├── pages
│   │   ├── LandingPage.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── ResidentDashboard.tsx
│   │   ├── OfficerDashboard.tsx
│   │   └── AdminDashboard.tsx
│   ├── services
│   │   ├── auth-service.ts
│   │   ├── geolocation-service.ts
│   │   ├── notification-service.ts
│   │   ├── offline-sync.ts
│   │   └── report-generator.ts
│   ├── hooks
│   │   └── useAuth.ts
│   ├── store
│   │   └── index.ts
│   ├── types
│   │   └── index.ts
│   └── styles
│       ├── globals.css
│       └── theme.css
├── tests
│   ├── components
│   │   └── ForumComponent.test.tsx
│   └── pages
│       └── Login.test.tsx
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Getting Started
1. **Clone the Repository**: 
   ```
   git clone <repository-url>
   cd neighborhood-watch-member-patrol-system
   ```

2. **Install Dependencies**: 
   ```
   npm install
   ```

3. **Run the Application**: 
   ```
   npm run dev
   ```

4. **Open in Browser**: Navigate to `http://localhost:3000` to view the application.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.