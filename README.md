# Lead Research SaaS

AI-powered research assistant for solopreneurs and founders. Analyze LinkedIn profiles, company websites, and PDFs to generate personalized conversation starters and market insights.

> [!NOTE]
> 🚧 **Still in Development**: This project is currently a work in progress. Features and UI are subject to change.

## 🚀 Quick Start

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env
# Edit .env with your MISTRAL_API_KEY and MONGODB_URI

# Run the server
python app.py
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run development server
npm run dev
```



## 📊 Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | ₹0 | 5 reports/month |
| Pro | ₹499/mo | 50 reports + Email drafts |
| Business | ₹1,499/mo | Unlimited + API access |

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Three.js
- **Backend**: Flask, Flask-CORS
- **Database**: MongoDB
- **AI**: Mistral AI (mistral-small-latest)
- **Deployment**: Vercel (frontend), Render (backend)

## 📁 Project Structure

```
virtual-assistant/
├── backend/
│   ├── app.py              # Flask API
│   ├── config.py           # Configuration
│   ├── models.py           # MongoDB models
│   └── services/
│       ├── mistral_service.py
│       ├── scraper_service.py
│       └── pdf_service.py
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Landing page
│   │   │   └── dashboard/
│   │   │       └── page.tsx    # Dashboard
│   │   └── components/
│   │       ├── Scene3D.tsx     # 3D background
│   │       ├── UrlAnalyzer.tsx
│   │       ├── PdfUploader.tsx
│   │       └── PricingTiers.tsx
└── .env.example
```
