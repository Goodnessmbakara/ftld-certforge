# FTLD CertForge

A modern certificate generation and verification platform for For The Love of DeFi (FTLD) programs.

## Features

- **Certificate Generation**: Create professional certificates for FTLD program completions
- **Verification System**: Verify certificate authenticity with unique codes and QR scanning
- **Social Sharing**: Share certificates on Twitter/X and LinkedIn
- **PDF Downloads**: Generate and download certificates as PDF files
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation and screen reader support

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, authentication, real-time)
- **Deployment**: Vercel
- **Libraries**: Lucide React (icons), html2pdf.js (PDF generation), qrcode.js (QR codes)

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm or yarn
- Supabase account

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/ftld/certforge.git
cd ftld-certforge
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Add your Supabase credentials:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

4. Set up the database:
- Run the SQL scripts in the `scripts/` folder in your Supabase SQL editor
- This will create the necessary tables and initial data

5. Run the development server:
\`\`\`bash
pnpm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
ftld-certforge/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── verify/            # Certificate verification
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── CertificatePreview.tsx  # Certificate display
│   ├── ProgressBar.tsx    # Loading progress
│   └── QRCodeGenerator.tsx # QR code generation
├── lib/                   # Utility functions
├── scripts/               # Database setup scripts
└── public/               # Static assets
\`\`\`

## Usage

### Admin Dashboard
1. Navigate to `/admin`
2. Fill in student details (name, program, completion date)
3. Click "Generate Certificate"
4. Preview, download, or share the certificate

### Certificate Verification
1. Navigate to `/verify`
2. Enter the verification code from a certificate
3. View validation results and certificate details

### Adding New Programs
1. Access your Supabase dashboard
2. Add new programs to the `programs` table
3. Set `is_active` to `true` to make them available

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the project: `pnpm run build`
2. Deploy the `.next` folder to your hosting provider
3. Ensure environment variables are set

## Customization

### Branding
- Update colors in `tailwind.config.js`
- Replace logo placeholder in `components/Header.tsx`
- Modify certificate design in `components/CertificatePreview.tsx`

### Programs
- Add new programs via the Supabase dashboard
- Programs are automatically available in the admin dropdown

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@ftld.org or create an issue in the GitHub repository.
