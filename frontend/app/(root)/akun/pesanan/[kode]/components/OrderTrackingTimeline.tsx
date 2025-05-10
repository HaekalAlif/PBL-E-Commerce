import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
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
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Status Pesanan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg border-red-200 bg-red-50 flex items-start">
            <Ban className="text-red-500 h-5 w-5 mt-0.5 mr-2" />
            <div>
              <h4 className="font-medium text-red-700">Pesanan Dibatalkan</h4>
              <p className="text-sm text-red-600">
                Pesanan ini telah dibatalkan.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Status Pesanan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="ml-6 mt-3 space-y-8">
            {steps.map((step, idx) => {
              const isActive = idx <= currentStep;
              const isCurrent = idx === currentStep;

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
                      className={`absolute left-[-24px] top-6 w-0.5 h-full ${
                        idx < currentStep ? "bg-[#F79E0E]" : "bg-gray-200"
                      }`}
                    />
                  )}

                  <div className="flex items-start mb-1">
                    <div
                      className={`absolute left-[-30px] rounded-full w-[30px] h-[30px] flex items-center justify-center ${
                        isActive
                          ? "bg-[#F79E0E] text-white"
                          : "bg-gray-200 text-gray-400"
                      } ${isCurrent ? "ring-4 ring-orange-100" : ""}`}
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
                      <p className="text-sm text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {trackingInfo?.resi && (
          <div className="mt-6 p-4 border rounded-lg bg-orange-50/50">
            <h4 className="font-medium mb-2">Informasi Pengiriman</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Kurir</p>
                <p className="font-medium">{trackingInfo.courier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nomor Resi</p>
                <p className="font-medium">{trackingInfo.resi}</p>
              </div>
            </div>

            <Button variant="outline" className="mt-3 text-sm h-8" asChild>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                Lacak Pengiriman
                <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
