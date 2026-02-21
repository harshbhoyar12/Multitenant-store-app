Techstack Used.
Nodejs v => 18 or above
Reactjs v => 18 or above
postgres db v => 14+

1. Backend Setup
cd backend
npm install
# Create a .env file and add DATABASE_URL="postgresql://user:pass@localhost:5432/nexus"
npx prisma migrate dev --name init
npm run seed
npm run dev

2. Frontend Setup
cd frontend
npm install
npm run dev

 Default Testing Accounts
| **Super Admin** | `admin@example.com` | `password123` |
| **Standard User** | `user@example.com` | `password123` |


Project Architecture & Flow

1. Authentication & Multi-Tenancy Flow
1. **User Login**: User authenticates via `/api/auth/login`.
2. **Context Selection**: The system retrieves all Organizations the user belongs to.
3. **Institute Scoping**: After selecting an Org, the system retrieves only the Institutes under that Org where the user is mapped.
4. **Global Context Injection**: JWT tokens for subsequent requests include `userId`, `activeOrgId`, and `activeInstituteId`.

2. App Store & Configuration Flow
1. **Catalog**: Admins register apps globally with categories (LMS, Finance, etc.).
2. **Installation**: Institute admins install apps at the institute level. This triggers a **Webhook** event logged in the database.
3. **Dynamic Config**: Institute admins can edit app behavior using the **JSON Configuration Editor** in the UI. Data is stored in a JSONB column in PostgreSQL.

3. Secure App Launch Flow
1. **Launch Request**: User clicks "Launch".
2. **Token Generation**: Backend generates a short-lived (15m) JWT token containing:
   - User ID & Permissions
   - Organization & Institute ID
   - Institute-specific JSON Configuration
3. **IFrame Embedding**: T
he app is rendered inside a secure IFrame. The token is passed as a query parameter (or header) to the micro-frontend/external app.




1. Setup Environment
1. **Database**: Run `npm run seed` in the `backend` folder to reset test accounts.
2. **Servers**: Start both `backend` (port 5000) and `frontend` (port 5173).

---

2. Role-Based Test Cases

Case A: Platform Administration (Super Admin)
**Login**: `admin@example.com` / `password123`
1. **Verification**: You should see **"Administration Console"** in the sidebar.
2. **Action**: Create a new Organization in the "Organization Registry".
3. **Action**: Register a dummy app in the "Application Catalog".
4. **App Store**: Navigate to the App Store. Install "Student Tracker" for the current institute.
5. **Config**: Click the **Settings (Gear)** icon on the installed app. Add a JSON value like `{"theme": "dark"}` and save.

Case B: Consumer Experience (Standard User)
**Login**: `user@example.com` / `password123`
1. **Verification (Sidebar)**: The "Administration Console" link **must be hidden**.
2. **Verification (App Store)**: 
   - No "Install" button should be visible on any app.
   - For "Student Tracker" (installed by admin), you should see a **"Launch"** button.
   - The **"Settings (Gear)"** icon **must be hidden**.
3. **Action**: Click **"Launch"**. The app should open in a modal/iframe.

Case C: Data Isolation (Multi-Tenancy)
1. **Login as Admin**. Select **Global Tech Corp / Institute of Coding**.
2. Install an app.
3. Switch Context to a different Organization/Institute (if created).
4. **Verification**: The app installed in the first institute **should not** appear as installed in the second one.
