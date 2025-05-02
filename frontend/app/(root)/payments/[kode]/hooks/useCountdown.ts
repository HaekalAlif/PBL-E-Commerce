import { useState, useEffect } from "react";
import { InvoiceDetails } from "../types";

export const useCountdown = (invoice: InvoiceDetails | null) => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    if (!invoice || !invoice.deadline_pembayaran) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const deadline = new Date(invoice.deadline_pembayaran);

      if (deadline <= now) {
        setTimeLeft("Expired");
        return;
      }

      const diffMs = deadline.getTime() - now.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft(
        `${diffHrs.toString().padStart(2, "0")}:${diffMins
          .toString()
          .padStart(2, "0")}:${diffSecs.toString().padStart(2, "0")}`
      );
    };

    calculateTimeLeft();
    const intervalId = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(intervalId);
  }, [invoice]);

  return timeLeft;
};
