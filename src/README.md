# NeighborGuard - Neighborhood Watch Member Patrol System

## Project Overview

A comprehensive web and mobile application for managing neighborhood security patrols, designed for security officers, residents, and administrators in Botswana.

**Team Members:**
- Aobakwe Ramoleko: 202000388
- Kazo Ndjavera: 202300663
- Cathrine Molatedi: 202003493

**Course:** CSI473

---

## System Features

### 1. Three User Types

#### A. Administrators
- **Access**: Web dashboard with 2FA email authentication
- **Capabilities**:
  - Approve/reject new officers and residents
  - Manage houses and security checkpoints
  - Suspend/delete users
  - View comprehensive system reports
  - Configure system settings
  - Monitor patrol compliance

#### B. Security Officers
- **Access**: Mobile app with username/password
- **Capabilities**:
  - Scan QR codes at patrol checkpoints
  - Add comments to scans (e.g., "gate open")
  - View personal scan history (read-only)
  - Receive patrol assignments
  - Offline functionality with auto-sync

#### C. Residents (Members)
- **Access**: Mobile app with username/password
- **Capabilities**:
  - View patrol statistics for their street
  - Participate in community forum
  - Emergency alert button
  - Make subscription payments
  - View payment history

---

## Architecture & Subsystems

### 1. User Management Subsystem
- **Location**: `/lib/auth-context.tsx`
- Account registration and approval workflow
- Login with role-based authentication
- 2FA for administrators via email
- Automatic officer reinstatement after suspension period

### 2. Patrol & Compliance Monitoring Subsystem
- **Location**: `/lib/compliance-monitor.ts`, `/lib/offline-sync.ts`
- QR code scanning with geolocation validation
- Offline scan storage using IndexedDB
- Automatic sync when connectivity restored
- Compliance rate calculation (min 70%)
- Automatic suspension for non-compliant officers

### 3. Notification & Alerting Subsystem
- **Location**: `/lib/notification-service.ts`
- Email notifications (2FA codes, approvals, reports)
- SMS alerts (emergencies, suspensions, payment reminders)
- Push notifications (forum replies, announcements)
- Multi-channel emergency alert broadcasting

### 4. Subscription & Payment Processing Subsystem
- **Location**: `/lib/payment-service.ts`
- Monthly subscription management
- Payment gateway integration (PayStack/Stripe ready)
- Automatic suspension after 2 months non-payment
- Payment history and receipt generation

### 5. Community Interaction Subsystem
- **Location**: `/components/ForumComponent.tsx`
- Community forum with threaded discussions
- Emergency alert system
- Real-time notifications

### 6. Reporting & Analytics Subsystem
- **Location**: `/lib/report-generator.ts`
- Daily patrol reports
- Weekly summary reports
- Monthly financial reports
- Compliance audit reports
- PDF export capability

### 7. Geolocation Services
- **Location**: `/lib/geolocation-service.ts`
- Real-time location tracking
- Distance validation for scans
- Geofencing for checkpoint validation

---

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4 + Custom CSS
- **UI Components**: Shadcn/UI
- **Icons**: Lucide React

### State Management
- **Auth**: React Context API
- **Local Storage**: IndexedDB for offline data
- **Session**: localStorage for persistence

### Services & APIs
- **Email**: SendGrid / AWS SES (configurable)
- **SMS**: Twilio / Africa's Talking (configurable)
- **Payments**: PayStack / Stripe (configurable)
- **Push Notifications**: Firebase Cloud Messaging / OneSignal

---

## File Structure

```
├── App.tsx                          # Main app with routing
├── components/
│   ├── TwoFactorAuth.tsx           # 2FA component for admins
│   ├── ForumComponent.tsx          # Community forum
│   └── ui/                         # Shadcn UI components
├── pages/
│   ├── LandingPage.tsx             # Public homepage
│   ├── Login.tsx                   # Login page
│   ├── Register.tsx                # Registration page
│   ├── AdminDashboard.tsx          # Admin control panel
│   ├── OfficerDashboard.tsx        # Officer mobile dashboard
│   ├── ResidentDashboard.tsx       # Resident mobile dashboard
│   └── Scanner.tsx                 # QR code scanner
├── lib/
│   ├── types.ts                    # TypeScript type definitions
│   ├── auth-context.tsx            # Authentication provider
│   ├── offline-sync.ts             # Offline functionality
│   ├── notification-service.ts     # Multi-channel notifications
│   ├── payment-service.ts          # Payment processing
│   ├── geolocation-service.ts      # Location services
│   ├── compliance-monitor.ts       # Patrol compliance checker
│   └── report-generator.ts         # Report generation
└── styles/
    └── globals.css                  # Global styles
```

---

## Key Workflows

### 1. User Registration & Approval
1. User registers via `/register`
2. Account created with `PENDING_APPROVAL` status
3. Admin reviews in dashboard
4. Admin approves/rejects
5. Email notification sent to user
6. User can log in if approved

### 2. Patrol Workflow (Officer)
1. Officer logs into mobile app
2. Opens scanner (`/scanner`)
3. Requests geolocation permission
4. Scans QR code at checkpoint
5. System validates:
   - QR code format
   - Geolocation proximity (within 50m)
6. Officer adds optional comment
7. Scan saved locally if offline
8. Auto-syncs when online
9. Compliance calculated at end of shift

### 3. Payment Workflow (Resident)
1. Resident navigates to payments
2. Selects subscription plan
3. Redirected to payment gateway
4. Completes payment
5. System verifies transaction
6. Subscription extended
7. Email receipt sent

### 4. Emergency Alert Workflow
1. Resident presses emergency button
2. Confirmation modal appears
3. On confirm, alert created
4. SMS sent to all officers
5. Push notifications to all residents
6. Email to administrators
7. Alert logged in system

### 5. Compliance Monitoring (Automated)
1. System runs daily at shift end
2. Calculates each officer's compliance rate
3. If < 70%:
   - Officer automatically suspended
   - SMS/Email sent to officer
   - Admin notified
   - Suspension end date set (7 days)
4. If 70-85%:
   - Warning sent to officer
5. Auto-reinstatement after suspension period

---

## Configuration

### Environment Variables
Create a `.env` file with:

```env
# Email Service
EMAIL_SERVICE_API_KEY=your_sendgrid_key
EMAIL_FROM=noreply@neighborguard.com

# SMS Service
SMS_API_KEY=your_twilio_key
SMS_FROM=+267XXXXXXXX

# Payment Gateway
PAYMENT_GATEWAY_API_KEY=your_paystack_key
PAYMENT_WEBHOOK_SECRET=your_webhook_secret

# Database (if using backend)
DATABASE_URL=your_database_url

# App Config
APP_URL=https://neighborguard.com
MIN_COMPLIANCE_RATE=70
SUBSCRIPTION_AMOUNT=50
```

---

## Security Features

1. **Two-Factor Authentication (2FA)**
   - Required for all administrator logins
   - 6-digit code sent via email
   - 10-minute expiration
   - Resend capability with 60s cooldown

2. **Password Security**
   - Passwords hashed (implement bcrypt in production)
   - Never stored in plain text
   - Minimum strength requirements

3. **Payment Security**
   - PCI-DSS compliant payment gateways
   - No credit card data stored locally
   - Webhook signature verification
   - HTTPS-only communication

4. **Data Privacy**
   - Geolocation data used only for validation
   - User data encrypted at rest
   - GDPR/POPIA compliant (implement in production)

---

## Offline Functionality

The system uses IndexedDB for robust offline support:

### Officer App Offline Capabilities
- ✅ Scan QR codes
- ✅ Add comments
- ✅ View scan history
- ✅ All data cached locally
- ✅ Auto-sync when online
- ✅ Conflict resolution

### Implementation
```typescript
// Scan is saved to IndexedDB with PENDING_SYNC status
await offlineSyncManager.saveScan(scan);

// When network restored, auto-sync runs
await offlineSyncManager.syncWithServer();
```

---

## Running the Application

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Production Deployment

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Deploy to hosting**:
   - Vercel, Netlify, or AWS Amplify for frontend
   - Set up backend API (Node.js/Python/PHP)
   - Configure database (PostgreSQL/MySQL)
   - Set up email/SMS services
   - Configure payment gateway

3. **Database Schema** (implement in production):
   - Users table
   - Houses table
   - PatrolScans table
   - Payments table
   - ForumPosts table
   - Alerts table

---

## Future Enhancements

1. **Mobile App** (React Native)
   - Native Android/iOS apps
   - Better offline performance
   - Native push notifications

2. **Real-time Features**
   - WebSocket for live updates
   - Real-time officer tracking on map
   - Live chat in forum

3. **Analytics Dashboard**
   - Interactive charts (Chart.js/Recharts)
   - Heat maps of patrol coverage
   - Predictive analytics for compliance

4. **Advanced Reporting**
   - PDF generation (jsPDF)
   - Excel exports
   - Scheduled email reports

5. **Integration**
   - Police department API
   - Weather API for patrol planning
   - Traffic API for route optimization

---

## Support & Contact

For technical support or questions:
- Email: support@neighborguard.com
- Phone: +267 XXX XXXX

---

## License

© 2024 NeighborGuard. All rights reserved.
