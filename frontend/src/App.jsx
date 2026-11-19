import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';

// Public Pages
import Home from './pages/Home';
import CompletedProjects from './pages/CompletedProjects';
import OngoingProjects from './pages/OngoingProjects';
import UpcomingProjects from './pages/UpcomingProjects';
import ProjectDetails from './pages/ProjectDetails';
import ConstructionTracker from './pages/ConstructionTracker';
import HouseVisualizer from './pages/HouseVisualizer';
import QuotationGenerator from './pages/QuotationGenerator';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Register from './pages/Register';
import WishlistPage from './pages/WishlistPage';
import MyEnquiries from './pages/MyEnquiries';

// Admin Components & Pages
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageProjects from './pages/admin/ManageProjects';
import ProjectForm from './pages/admin/ProjectForm';
import ManageProperties from './pages/admin/ManageProperties';
import PropertyForm from './pages/admin/PropertyForm';
import ManageEnquiries from './pages/admin/ManageEnquiries';

// Layout with Navbar and Footer
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <Router>
          <Routes>
            {/* Public Routes with Navbar and Footer */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/completed-projects" element={<CompletedProjects />} />
              <Route path="/ongoing-projects" element={<OngoingProjects />} />
              <Route path="/upcoming-projects" element={<UpcomingProjects />} />
              <Route path="/tracker" element={<ConstructionTracker />} />
              <Route path="/tracker/:id" element={<ConstructionTracker />} />
              <Route path="/visualizer" element={<HouseVisualizer />} />
              <Route path="/visualizer/:id" element={<HouseVisualizer />} />
              <Route path="/quotation" element={<QuotationGenerator />} />
              <Route path="/quote" element={<QuotationGenerator />} />
              <Route path="/projects/:idOrSlug" element={<ProjectDetails />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:idOrSlug" element={<PropertyDetails />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/my-enquiries" element={<MyEnquiries />} />
            </Route>

            {/* Admin Management Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="projects/new" element={<ProjectForm />} />
              <Route path="projects/edit/:id" element={<ProjectForm />} />
              <Route path="properties" element={<ManageProperties />} />
              <Route path="properties/new" element={<PropertyForm />} />
              <Route path="properties/edit/:id" element={<PropertyForm />} />
              <Route path="enquiries" element={<ManageEnquiries />} />
            </Route>
          </Routes>
        </Router>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
