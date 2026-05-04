import { COLORS_SEKAI_KEYS, createSekai, LIGHT_MODE, YourSekaiProvider } from '@naru/untitled-ui-library';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { NotFound } from './pages/NotFound';
import { Top } from './pages/Top';

export function App() {
  const theme = createSekai({
    palette: {
      sekai: COLORS_SEKAI_KEYS.Miku,
      mode: LIGHT_MODE,
    },
  });

  return (
    <BrowserRouter>
      <YourSekaiProvider sekaiTheme={theme} options={{ disableStoreSekai: true }}>
        <Layout>
          <Routes>
            <Route path="/" element={<Top />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </YourSekaiProvider>
    </BrowserRouter>
  );
}
