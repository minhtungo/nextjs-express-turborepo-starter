import ThemeProvider from "@/components/providers/ThemeProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

export default Providers;
