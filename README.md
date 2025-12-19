# 🚗 Carsure360 - Vehicle Inspection Report Generator

A modern React-based vehicle inspection application that generates professional PDF reports. Built with React 19, Vite, Tailwind CSS, and features comprehensive vehicle assessment forms with automated rating calculations.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.19-06B6D4?style=flat&logo=tailwindcss)

## ✨ Features

- 📝 **Comprehensive Inspection Forms** - Capture vehicle details, exterior, interior, engine, AC, electrical, and tyre conditions
- 📸 **Image Upload** - Upload and manage inspection photos
- 📊 **Automatic Rating Calculation** - Smart rating system based on component conditions
- 📄 **PDF Report Generation** - Generate professional PDF reports using jsPDF and html2canvas
- 📱 **Responsive Design** - Mobile-first design that works on all devices
- 💾 **State Management** - Powered by Zustand for efficient state handling

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MohitShishodia/Carsure360.git
   cd Carsure360/carsure360-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

## 📁 Project Structure

```
carsure360-react/
├── public/              # Static assets
├── server/              # Server-side utilities (PDF generation)
├── src/
│   ├── assets/          # Images and static files
│   ├── components/      # React components
│   │   ├── FormComponents/  # Form input components
│   │   └── Report/          # PDF report components
│   ├── data/            # Static data (dropdown options, etc.)
│   ├── stores/          # Zustand state management
│   ├── utils/           # Utility functions (rating calculator)
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **PDF Generation**: jsPDF + html2canvas
- **Linting**: ESLint

## 📝 Usage

1. **Fill Vehicle Details** - Enter basic vehicle information (make, model, year, etc.)
2. **Conduct Inspection** - Go through each section (Exterior, Interior, Engine, etc.)
3. **Upload Images** - Add photos for each inspection area
4. **Generate Report** - Click "Generate PDF" to create a professional inspection report

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private. All rights reserved.

## 👨‍💻 Author

**Mohit Shishodia**

- GitHub: [@MohitShishodia](https://github.com/MohitShishodia)

---

Made with ❤️ for the automotive industry
