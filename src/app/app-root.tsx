import { AppProvider, AppRouter } from '@/app/providers';

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
