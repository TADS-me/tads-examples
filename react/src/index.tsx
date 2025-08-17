import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

import { Root } from '@/components/Root.tsx';
import { EnvUnsupported } from '@/components/EnvUnsupported.tsx';
import { init } from '@/init.ts';

import '@telegram-apps/telegram-ui/dist/styles.css';
import './index.css';

// Mock the environment in case, we are outside Telegram.
import './mockEnv.ts';

const root = ReactDOM.createRoot(document.getElementById('root')!);

function detectFullscreenChange() {
  let safeAreaTop = 0
  let contentSafeAreaTop = 0

  window.addEventListener('message', (e) => {
    if (e.data.includes('content_safe_area_changed')) {
      const { eventData } = JSON.parse(e.data)

      if (eventData.top) {
        contentSafeAreaTop = eventData.top
        sessionStorage.setItem('isFullscreen', '1')
      } else {
        contentSafeAreaTop = 0
        sessionStorage.setItem('isFullscreen', '0')
      }
    }

    if (e.data.includes('safe_area_changed')) {
      const { eventData } = JSON.parse(e.data)

      if (eventData.top) {
        safeAreaTop = eventData.top
      } else {
        safeAreaTop = 0
      }
    }

    document.documentElement.style.setProperty('--safe-area-top', `${safeAreaTop + contentSafeAreaTop}px`)
  })

  window.parent.postMessage(JSON.stringify({
    eventType: 'web_app_request_content_safe_area'
  }), '*');

  window.parent.postMessage(JSON.stringify({
    eventType: 'web_app_request_safe_area'
  }), '*');
}

try {
  detectFullscreenChange()

  // Configure all application dependencies.
  init(retrieveLaunchParams().startParam === 'debug' || import.meta.env.DEV);

  root.render(
    <StrictMode>
      <Root/>
    </StrictMode>,
  );
} catch (e) {
  root.render(<EnvUnsupported/>);
}
