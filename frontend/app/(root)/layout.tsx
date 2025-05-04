import { Toaster } from "@/components/ui/toast";
import Navigation from "@/components/layout/nav";
import Footer from "@/components/layout/footer";

export default function RootPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
}
