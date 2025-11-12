import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <Card className="max-w-md w-full text-center p-8">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="w-12 h-12 text-gray-500" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
            <p className="text-gray-600">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => navigate("/")}
              className="w-full"
            >
              <ApperIcon name="Home" className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Quick Links</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/transactions")}
              >
                Transactions
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/budgets")}
              >
                Budgets
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/goals")}
              >
                Goals
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/charts")}
              >
                Charts
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;