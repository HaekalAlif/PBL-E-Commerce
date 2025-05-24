import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ExternalLink, TruckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackingSteps } from "../types";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  CircleCheck,
  Ban,
  Shield,
  PackageCheck,
} from "lucide-react";

interface OrderTrackingTimelineProps {
  currentStep: number;
  steps: typeof trackingSteps;
  trackingInfo?: {
    resi?: string;
    courier?: string;
  };
  isCancelled?: boolean;
}

export const OrderTrackingTimeline = ({
  currentStep,
  steps,
  trackingInfo,
  isCancelled,
}: OrderTrackingTimelineProps) => {
  if (isCancelled) {
    return (
      <Card className="border-orange-100">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 rounded-lg bg-orange-50">
              <Clock className="h-4 w-4 text-[#F79E0E]" />
            </div>
            <span className="font-medium">Status Pesanan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg border-red-200 bg-red-50 flex items-start">
            <Ban className="text-red-500 h-5 w-5 mt-0.5 mr-2" />
            <div>
              <h4 className="font-medium text-red-700">Pesanan Dibatalkan</h4>
              <p className="text-sm text-red-600 mt-1">
                Pesanan ini telah dibatalkan.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 rounded-lg bg-orange-50">
            <Clock className="h-4 w-4 text-[#F79E0E]" />
          </div>
          <span className="font-medium">Status Pesanan</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="ml-6 mt-3 space-y-8">
            {steps.map((step, idx) => {
              const isActive = idx <= currentStep;
              const isCurrent = idx === currentStep;

              // Only show completed state up to current step
              const isCompleted = idx < currentStep;

              return (
                <motion.div
                  key={step.status}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pb-1"
                >
                  {idx < steps.length - 1 && (
                    <div
                      className={`absolute left-[-24px] top-6 w-0.5 h-full 
                        ${isCompleted ? "bg-[#F79E0E]" : "bg-gray-200"}`}
                    />
                  )}

                  <div className="flex items-start mb-1">
                    <div
                      className={`absolute left-[-30px] rounded-full w-[30px] h-[30px] 
                        flex items-center justify-center transition-all duration-200
                        ${
                          isActive
                            ? "bg-[#F79E0E] text-white"
                            : "bg-gray-200 text-gray-400"
                        }
                        ${isCurrent ? "ring-4 ring-orange-100" : ""}`}
                    >
                      <step.icon className="h-4 w-4" />
                    </div>

                    <div className="ml-2 flex-1">
                      <h4
                        className={`font-medium ${
                          isActive ? "text-[#F79E0E]" : "text-gray-400"
                        }`}
                      >
                        {step.status}
                      </h4>
                      <p
                        className={`text-sm ${
                          isActive ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
