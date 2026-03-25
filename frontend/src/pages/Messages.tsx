import { MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center container-max px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="h-10 w-10 text-secondary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Messaging coming soon!</h1>
          <p className="text-muted-foreground">
            We're currently migrating our real-time messaging system to our new high-performance MongoDB backend. Check back soon for better speed and reliability!
          </p>
          <div className="pt-4">
            <Button onClick={() => navigate("/dashboard")} variant="hero">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Messages;
