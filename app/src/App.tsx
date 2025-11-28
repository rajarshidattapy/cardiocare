import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { WellnessProvider } from "@/contexts/WellnessContext";
import { BottomNav } from "@/components/layout/BottomNav";
import { Navbar } from "@/components/layout/Navbar";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import WellnessPlan from "./pages/WellnessPlan";
import Insights from "./pages/Insights";
import Recommendations from "./pages/Recommendations";
import Profile from "./pages/Profile";
import CrisisMode from "./pages/CrisisMode";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const queryClient = new QueryClient();

// Get Clerk publishable key from environment
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

const App = () => (
  <ClerkProvider publishableKey={clerkPubKey}>
    <QueryClientProvider client={queryClient}>
      <WellnessProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen">
              <Navbar />
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/sign-up" element={<SignUp />} />

                {/* Protected routes - redirect to login if not authenticated */}
                <Route
                  path="/"
                  element={
                    <>
                      <SignedIn>
                        <Dashboard />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <>
                      <SignedIn>
                        <Notifications />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  }
                />
                <Route
                  path="/plan"
                  element={
                    <>
                      <SignedIn>
                        <WellnessPlan />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  }
                />
                <Route
                  path="/insights"
                  element={
                    <>
                      <SignedIn>
                        <Insights />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  }
                />
                <Route
                  path="/recommendations"
                  element={
                    <>
                      <SignedIn>
                        <Recommendations />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <>
                      <SignedIn>
                        <Profile />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  }
                />
                <Route
                  path="/crisis"
                  element={
                    <>
                      <SignedIn>
                        <CrisisMode />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <SignedIn>
                <BottomNav />
              </SignedIn>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </WellnessProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
