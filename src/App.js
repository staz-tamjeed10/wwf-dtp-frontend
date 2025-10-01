import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Features from "./components/Features";
import NewsEvents from "./components/NewsEvents";
import Partners from "./components/Partners";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SlaughterhouseDashboard from "./pages/SlaughterhouseDashboard";
import TraderDashboard from "./pages/TraderDashboard";
import TanneryDashboard from "./pages/TanneryDashboard";
import GarmentDashboard from "./pages/GarmentDashboard";
import { fetchWithAuth } from "./utils/api";
import Trace from "./pages/Trace";
import TraceFromQR from "./pages/TraceFromQR";
import GarmentPrintQR from "./pages/GarmentPrintQR";

function App() {
  const [activeSection, setActiveSection] = useState("Home");
  const [userRole, setUserRole] = useState(null);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetchWithAuth(
        "https://ret.bijlicity.com/api/auth/profile/"
      );

      if (response.ok) {
        const data = await response.json();

        // Handle null or undefined role safely
        const role = data.role || "visitor";
        setUserRole(role.toLowerCase());

        // Check if user is superuser/admin (you might need to adjust this based on your API response)
        setIsSuperuser(data.is_superuser || data.user?.is_superuser || false);

        // Store user info in localStorage for easy access
        localStorage.setItem("user_role", role.toLowerCase());
        localStorage.setItem(
          "is_superuser",
          data.is_superuser || data.user?.is_superuser || "false"
        );
      } else {
        setUserRole(null);
        setIsSuperuser(false);
        localStorage.removeItem("user_role");
        localStorage.removeItem("is_superuser");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserRole(null);
      setIsSuperuser(false);
      localStorage.removeItem("user_role");
      localStorage.removeItem("is_superuser");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
      setUserRole(null);
      setIsSuperuser(false);
    }
  }, [fetchUserProfile]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            userRole ? (
              <Navigate to={getDashboardPath(userRole, isSuperuser)} replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <DashboardLayout
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              setUserRole={setUserRole}
              setIsSuperuser={setIsSuperuser}
              userRole={userRole}
              isSuperuser={isSuperuser}
            />
          }
        />

        <Route
          path="/login"
          element={
            userRole ? (
              <Navigate to={getDashboardPath(userRole, isSuperuser)} replace />
            ) : (
              <Login
                setActiveSection={setActiveSection}
                setUserRole={setUserRole}
                setIsSuperuser={setIsSuperuser}
                activeNav={activeSection}
                userRole={userRole}
              />
            )
          }
        />

        <Route
          path="/register"
          element={
            <Register
              setActiveSection={setActiveSection}
              setUserRole={setUserRole}
              setIsSuperuser={setIsSuperuser}
              activeNav={activeSection}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/logout"
          element={
            <Logout
              setActiveSection={setActiveSection}
              setUserRole={setUserRole}
              setIsSuperuser={setIsSuperuser}
              activeNav={activeSection}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <Profile
              setActiveSection={setActiveSection}
              setUserRole={setUserRole}
              setIsSuperuser={setIsSuperuser}
              activeNav={activeSection}
              userRole={userRole}
              isSuperuser={isSuperuser}
            />
          }
        />
        <Route
          path="/settings"
          element={
            <Settings
              setActiveSection={setActiveSection}
              setUserRole={setUserRole}
              setIsSuperuser={setIsSuperuser}
              activeNav={activeSection}
              userRole={userRole}
            />
          }
        />

        <Route
          path="/slaughterhouse-dashboard"
          element={
            <ProtectedRoute
              requiredRole="slaughterhouse"
              userRole={userRole}
              isSuperuser={isSuperuser}
            >
              <SlaughterhouseDashboard
                setActiveSection={setActiveSection}
                setUserRole={setUserRole}
                setIsSuperuser={setIsSuperuser}
                activeNav={activeSection}
                userRole={userRole}
                isSuperuser={isSuperuser}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trader-dashboard"
          element={
            <ProtectedRoute
              requiredRole="trader"
              userRole={userRole}
              isSuperuser={isSuperuser}
            >
              <TraderDashboard
                setActiveSection={setActiveSection}
                setUserRole={setUserRole}
                setIsSuperuser={setIsSuperuser}
                activeNav={activeSection}
                userRole={userRole}
                isSuperuser={isSuperuser}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tannery-dashboard"
          element={
            <ProtectedRoute
              requiredRole="tannery"
              userRole={userRole}
              isSuperuser={isSuperuser}
            >
              <TanneryDashboard
                setActiveSection={setActiveSection}
                setUserRole={setUserRole}
                setIsSuperuser={setIsSuperuser}
                activeNav={activeSection}
                userRole={userRole}
                isSuperuser={isSuperuser}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/garment-dashboard"
          element={
            <ProtectedRoute
              requiredRole="garment"
              userRole={userRole}
              isSuperuser={isSuperuser}
            >
              <GarmentDashboard
                setActiveSection={setActiveSection}
                setUserRole={setUserRole}
                setIsSuperuser={setIsSuperuser}
                activeNav={activeSection}
                userRole={userRole}
                isSuperuser={isSuperuser}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trace"
          element={
            <Trace
              isHomePage={false}
              userRole={userRole}
              isSuperuser={isSuperuser}
              activeNav={activeSection}
              setActiveSection={setActiveSection}
            />
          }
        />
        <Route path="/tags/:tagId" element={<TraceFromQR />} />
        <Route
          path="/garment/print-qr/:garmentId"
          element={<GarmentPrintQR />}
        />
      </Routes>
    </Router>
  );
}

function DashboardLayout({
  activeSection,
  setActiveSection,
  setUserRole,
  setIsSuperuser,
  userRole,
  isSuperuser,
}) {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const newsRef = useRef(null);
  const partnersRef = useRef(null);
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const sectionRefs = useMemo(
    () => ({
      Home: homeRef,
      About: aboutRef,
      Features: featuresRef,
      "News & Events": newsRef,
      Partners: partnersRef,
    }),
    []
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetchWithAuth(
          "https://ret.bijlicity.com/api/auth/profile/"
        );
        if (response.ok) {
          const data = await response.json();

          // Handle null or undefined role safely
          const role = data.role || "visitor";
          setUserRole(role.toLowerCase());
          setIsSuperuser(data.is_superuser || data.user?.is_superuser || false);

          localStorage.setItem("user_role", role.toLowerCase());
          localStorage.setItem(
            "is_superuser",
            data.is_superuser || data.user?.is_superuser || "false"
          );
        } else {
          setUserRole(null);
          setIsSuperuser(false);
          localStorage.removeItem("user_role");
          localStorage.removeItem("is_superuser");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserRole(null);
        setIsSuperuser(false);
        localStorage.removeItem("user_role");
        localStorage.removeItem("is_superuser");
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("token")) {
      fetchUserProfile();
    } else {
      setLoading(false);
      setUserRole(null);
      setIsSuperuser(false);
    }
  }, [location.pathname, setUserRole, setIsSuperuser]);

  useEffect(() => {
    if (location.pathname.includes("slaughterhouse-dashboard")) {
      setActiveSection("Slaughterhouse Dashboard");
    } else if (location.pathname.includes("trader-dashboard")) {
      setActiveSection("Trader Dashboard");
    } else if (location.pathname.includes("tannery-dashboard")) {
      setActiveSection("Tannery Dashboard");
    } else if (location.pathname.includes("garment-dashboard")) {
      setActiveSection("Garment Dashboard");
    } else if (location.pathname === "/dashboard") {
      setActiveSection("Home");
    }
  }, [location.pathname, setActiveSection]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 130;

      for (const [key, ref] of Object.entries(sectionRefs)) {
        const el = ref.current;
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(key);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionRefs, setActiveSection]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar
        sectionRefs={sectionRefs}
        activeNav={activeSection}
        setActiveSection={setActiveSection}
        isHomePage={location.pathname === "/dashboard"}
        userRole={userRole}
        isSuperuser={isSuperuser}
      />
      <div ref={homeRef}>
        <Hero />
      </div>
      <div ref={aboutRef}>
        <About />
      </div>
      <div ref={featuresRef}>
        <Features />
      </div>
      <div ref={newsRef}>
        <NewsEvents />
      </div>
      <div ref={partnersRef}>
        <Partners />
      </div>
      <Footer />
      <BackToTop setActiveSection={setActiveSection} />
    </>
  );
}

function ProtectedRoute({ children, requiredRole, userRole, isSuperuser }) {
  console.log("ProtectedRoute:", { userRole, isSuperuser, requiredRole });
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // SUPERUSERS (isSuperuser=true) CAN ACCESS ANY DASHBOARD
  if (isSuperuser) {
    console.log("Superuser access granted to", requiredRole);
    return children;
  }

  // VISITORS CAN ACCESS ALL DASHBOARDS IN VIEW-ONLY MODE
  if (userRole === "visitor") {
    console.log("Visitor access granted to", requiredRole, "(view-only)");
    return children;
  }

  // Regular users can only access their specific dashboard
  if (userRole === requiredRole) {
    console.log("Regular user access granted to", requiredRole);
    return children;
  }

  console.log("Access denied. Redirecting...");
  return <Navigate to={getDashboardPath(userRole, isSuperuser)} replace />;
}

function getDashboardPath(userRole, isSuperuser) {
  if (!userRole) return "/dashboard";

  // For superusers and visitors, check if they're already on a specific dashboard
  // If they're trying to access a specific dashboard, let them
  const currentPath = window.location.pathname;

  if (isSuperuser || userRole === "visitor") {
    // If superuser or visitor is already on a specific dashboard, stay there
    if (currentPath.includes("slaughterhouse-dashboard"))
      return "/slaughterhouse-dashboard";
    if (currentPath.includes("trader-dashboard")) return "/trader-dashboard";
    if (currentPath.includes("tannery-dashboard")) return "/tannery-dashboard";
    if (currentPath.includes("garment-dashboard")) return "/garment-dashboard";

    // Otherwise default to first dashboard for superusers, main dashboard for visitors
    if (isSuperuser) return "/slaughterhouse-dashboard";
    return "/dashboard";
  }

  const roleMap = {
    slaughterhouse: "/slaughterhouse-dashboard",
    trader: "/trader-dashboard",
    tannery: "/tannery-dashboard",
    garment: "/garment-dashboard",
    visitor: "/dashboard",
    admin: "/dashboard",
  };

  return roleMap[userRole] || "/dashboard";
}

export default App;
