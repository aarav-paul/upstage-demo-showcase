# Upstage AI Capabilities Demo Showcase

A comprehensive, interactive demonstration of Upstage's three core AI capabilities: **Document Parse**, **Universal Information Extraction**, and **Solar LLM**. Built with React 18, TypeScript, and modern web technologies to showcase the full potential of Upstage's AI platform.

## 🎯 Demo Overview

This showcase demonstrates how Upstage's AI capabilities can transform document processing workflows, from raw document parsing to intelligent data extraction and reasoning-based Q&A. Each demo is designed to be both educational and practical, showing real-world applications of advanced AI technology.

## 🚀 Live Demo

**URL**: [Demo Link - Add your deployed URL here]

## 📸 Screenshots & Features

### 🏠 Landing Page
![image](https://github.com/user-attachments/assets/eff8c541-2cd0-4b62-8d2a-8852c981d243)

*Professional hero section with interactive navigation and modern UI*

### 🔍 Document Parse Demo
![image](https://github.com/user-attachments/assets/45684c3a-7330-44db-8dbb-72321ff4211d)

*Multi-format file upload with real-time processing simulation*

### 📊 Information Extractor Demo
![image](https://github.com/user-attachments/assets/90565622-ba8f-4fa8-b85e-9c1901fa3830)

*Schema management interface with structured data extraction results*

### 🧠 Solar LLM Demo
![image](https://github.com/user-attachments/assets/44786713-8d63-46c6-aa42-6e8b08a3f907)

*Advanced reasoning chat interface with chain-of-thought processing*


### 🏠 Landing Page
- **Professional Hero Section**: Clean introduction to all three capabilities
- **Interactive Navigation**: Smooth scrolling between demo sections
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Gradient cards, smooth animations, and professional styling

### 🔍 Document Parse Demo
**What it demonstrates**: Advanced document layout understanding and element extraction

**Key Features**:
- **Multi-format File Upload**: Supports PDF, PNG, JPG, JPEG with drag-and-drop
- **Real-time Processing Simulation**: Multi-stage progress indicators (Upload → Processing → Analysis → Results)
- **Comprehensive Results Display**:
  - Element categorization (Tables, Forms, Text Blocks, Images)
  - Confidence scores for each extracted element
  - Coordinate positioning for precise layout understanding
  - Download options (JSON, CSV, PDF)
- **Advanced Features Showcase**:
  - Chart and equation recognition
  - Multi-language support
  - Rotated text handling
  - Complex layout analysis

**Use Cases**: Invoice processing, form digitization, document archiving, research paper analysis

### 📊 Universal Information Extractor Demo
**What it demonstrates**: Schema-based structured data extraction from unstructured documents

**Key Features**:
- **Schema Management**:
  - Manual schema creation with field types (text, number, date, boolean, array)
  - Automatic schema generation from sample documents
  - Pre-built schemas for common document types (invoices, resumes, contracts)
- **Document Processing**:
  - Multiple document type support (invoices, research papers, financial reports)
  - Real-time extraction simulation with progress tracking
  - Field-level confidence scoring
- **Results Display**:
  - Three view modes: Formatted, JSON, and Schema
  - Copy and download functionality
  - Detailed extraction metrics
- **Professional UI**: Tabs, progress indicators, and comprehensive data visualization

**Use Cases**: Data migration, automated data entry, content processing, compliance reporting

### 🧠 Solar LLM Demo
**What it demonstrates**: Advanced reasoning with chain-of-thought processing and document-aware Q&A

**Key Features**:
- **Reasoning Configuration**:
  - Adjustable reasoning effort levels (Low, Medium, High)
  - Toggle for thinking process visibility
  - Real-time reasoning effort descriptions
- **Document Context**:
  - Multiple document types (Invoice, Research Paper, Financial Report)
  - Document selection with summaries
  - File upload simulation
- **Advanced Chat Interface**:
  - Streaming responses with word-by-word generation
  - Chain-of-thought thinking process visualization
  - Token usage tracking and processing time metrics
  - Document-specific sample questions
- **Conversation Management**:
  - Download full conversations
  - Copy individual responses
  - Auto-scroll to latest messages

**Use Cases**: Document search, content analysis, intelligent assistants, research support

## 🛠 Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** for version control

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/upstage-demo-showcase.git
   cd upstage-demo-showcase
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in Browser**
   - Navigate to `http://localhost:5173`
   - The demo should load automatically with all features working

### Build for Production

1. **Create Production Build**
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Preview Production Build**
   ```bash
   npm run preview
   # or
   yarn preview
   ```

3. **Deploy**
   - The `dist` folder contains the production-ready files
   - Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

### Environment Configuration

The demo currently uses simulated data for demonstration purposes. To integrate with real Upstage APIs:

1. **Get API Keys**
   - Sign up at [Upstage AI](https://upstage.ai)
   - Generate API keys for each service

2. **Configure Environment Variables**
   ```bash
   # Create .env.local file
   VITE_UPSTAGE_API_KEY=your_api_key_here
   VITE_UPSTAGE_BASE_URL=https://api.upstage.ai/v1
   ```

3. **Update API Calls**
   - Replace simulation functions with actual API calls
   - Add proper error handling and loading states

## 🏗 Project Structure

```
src/
├── components/
│   ├── DocumentParseDemo.tsx      # Document parsing showcase
│   ├── InformationExtractorDemo.tsx # Information extraction demo
│   ├── SolarLLMDemo.tsx          # Solar LLM reasoning demo
│   ├── Header.tsx                 # Navigation header
│   ├── Hero.tsx                   # Landing page hero
│   ├── Footer.tsx                 # Page footer
│   └── ui/                        # shadcn/ui components
├── pages/
│   ├── Index.tsx                  # Main landing page
│   └── NotFound.tsx               # 404 page
├── hooks/                         # Custom React hooks
├── lib/                           # Utility functions
└── main.tsx                      # Application entry point
```

## 🎨 Technologies Used

### Core Framework
- **React 18** - Modern component-based architecture with hooks
- **TypeScript** - Type-safe development with comprehensive interfaces
- **Vite** - Fast build tool and development server

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **shadcn/ui** - Professional component library with accessibility features
- **Lucide React** - Beautiful, consistent icon system

### Key Features
- **Responsive Design** - Optimized for all device sizes
- **Professional UI** - Modern gradients, smooth animations, and clean typography
- **Accessibility** - WCAG compliant components and interactions
- **Performance** - Optimized bundle size and fast loading times

## 🚀 Deployment Options

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with one click

### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

### GitHub Pages
1. Add to `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Deploy: `npm run deploy`

## 💡 Developer Feedback & Suggestions

### Documentation Improvements

1. **Interactive API Playground**
   - Create a live, interactive playground similar to Postman but specifically for Upstage APIs
   - Allow developers to test API calls with real documents and see immediate results
   - Include pre-built examples for each capability with downloadable code snippets

2. **Comprehensive SDK Documentation**
   - Provide SDKs for popular languages (Python, JavaScript, Java, Go)
   - Include detailed integration guides with step-by-step tutorials
   - Add video walkthroughs for complex integrations
   - Create starter templates for common use cases

3. **Enhanced Developer Portal**
   - Build a comprehensive developer portal with:
     - Real-time API status and performance metrics
     - Usage analytics and rate limit information
     - Interactive documentation with live examples
     - Community showcase of successful integrations

### Developer Community Engagement


 **Developer Experience**
   - **Webhook Testing Tools**: Interactive webhook playground for testing integration flows
   - **Rate Limit Monitoring**: Real-time dashboard showing API usage and limits
   - **Error Handling Guides**: Comprehensive error code documentation with solutions
   - **Performance Optimization**: Guidelines for optimal API usage and caching strategies
**Integration Support**
   - **Pre-built Integrations**: Ready-to-use integrations for popular platforms (Zapier, Make, etc.)
   - **Webhook Templates**: Pre-configured webhook setups for common workflows
   - **Testing Suites**: Comprehensive test suites for validating integrations
   - **Migration Guides**: Step-by-step guides for migrating from other AI services

## 📞 Support & Contact

- **Documentation**: [Upstage AI Docs](https://docs.upstage.ai)
- **API Reference**: [Upstage API Docs](https://docs.upstage.ai/api)


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

