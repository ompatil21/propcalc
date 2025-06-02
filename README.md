🏠 PropCalc – Smarter Property Investment Analysis
PropCalc is a full-stack property investment calculator designed for Australian investors. It helps evaluate a property’s cash flow, tax impact, depreciation benefits, and long-term ROI — all in one intelligent, user-friendly platform.

Built with a scalable tech stack and real-world investing needs in mind, PropCalc empowers users to make confident, data-driven investment decisions.

🔧 Tech Stack
Frontend: Next.js (TypeScript), Tailwind CSS, Chart.js

Backend: Flask (Python), REST API with JWT authentication

Database: MongoDB (NoSQL), integrated with full validation and forecasting logic

🚀 Key Features
🏘 Multi-step Property Input
Capture all essential investment details — purchase price, loan structure, ownership, forecasting, depreciation, and more.

📊 Dynamic Tax & Cash Flow Calculator
Calculates gross yield, tax deductions, net cash flow, and owner-specific after-tax positions.

📈 Portfolio Dashboard
Visualize investment performance across multiple properties using charts and analytics.

👥 Multi-owner Support
Define ownership percentages, income brackets, and simulate tax impact for each owner.

⚙️ Admin Dashboard
Manage users, track property uploads, view analytics, and maintain system-wide control.

📁 Project Structure
src/
├── app/ # Next.js pages and routes
├── components/ # Reusable UI components
├── services/ # API integration layer
├── backend/ # Flask app and business logic
└── utils/ # Helper functions and constants

📦 Installation
1. Clone the Repo
git clone https://github.com/propCalROI/propcalc.git
cd propcalc

2. Install Backend (Flask API)
cd backend
pip install -r requirements.txt
python app.py

3. Install Frontend (Next.js)
cd ../src
npm install
npm run dev

⚠️ Make sure to configure .env files for both backend and frontend with proper Mongo URI, JWT secret, and base URLs.

🔒 Authentication

JWT-based user login and registration
Role-based access control (Admin vs User)
Secure protected routes for key operations

🏡 Property Features Supported

Purchase, loan, and deposit details
All common investment expenses (insurance, strata, water, etc.)
Vacancy rate, LVR, LMI, interest rate
Building and fittings depreciation
Capital gains & holding period forecast
Multi-owner breakdowns with tax impact simulation

🧠 Future Enhancements

📄 PDF export of tax reports
🔁 Investment comparison tool
⏰ Notification system for tax deadlines
🤖 AI-based property suggestions (experimental)

📬 Contact
For questions, suggestions, or contributions:
📧 Email: officialompatil@gmail.com




