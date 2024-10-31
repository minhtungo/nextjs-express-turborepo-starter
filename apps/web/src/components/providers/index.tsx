import ThemeProvider from '@/components/providers/ThemeProvider';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
};

export default Providers;
