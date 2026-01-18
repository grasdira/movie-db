import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { HomePage } from '@/pages/Homepage';

function App() {
  return (
    <MantineProvider defaultColorScheme="auto">
      <HomePage />
    </MantineProvider>
  );
}

export default App;
