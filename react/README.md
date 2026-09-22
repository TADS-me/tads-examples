# Stick Hero Game with TADS Integration

A Telegram Mini App demonstrating how to integrate TADS for monetization through ads.

## 🎯 What is TADS?

[TADS](https://tads.me/register?source=example&intent=publisher) is a advertising network that allows developers to monetize their Telegram Mini Apps through:
- **Static/TGB ads** - Clickable banner ads
- **Fullscreen ads** - Video ads for rewards

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
npm install react-tads-widget
```

### Set up TadsWidgetProvider

Wrap your app with the provider for optimal performance:

```tsx
// src/App.tsx
import { TadsWidgetProvider } from 'react-tads-widget';

function App() {
  return (
    <TadsWidgetProvider>
      {/* Your app components */}
    </TadsWidgetProvider>
  );
}
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `https://localhost:5173/`

## 🔍 Where to Find TADS Integration

### 1. **TADS Widget Components** (`src/pages/AdsPage/AdsPage.tsx`)

```tsx
import { TadsWidget } from 'react-tads-widget';

// Static ad for reward by clicks
<TadsWidget 
  id="1" 
  type="static" 
  debug={true}
  onClickReward={rewardUserByClick}
  onAdsNotFound={onAdsNotFound}
/>

// Fullscreen ad for rewards by impressions
<TadsWidget 
  id="4" 
  type="fullscreen" 
  debug={true} 
  onShowReward={rewardUserByShow}
  onAdsNotFound={onAdsNotFound} 
/>
```

### 2. **Game Integration** (`src/pages/GamePage/GamePage.tsx`)

```tsx
// Free restart via fullscreen ad
<TadsWidget 
  id="4" 
  type="fullscreen" 
  debug={true} 
  onShowReward={onAdReward}
  onAdsNotFound={onAdsNotFound} 
/>
```


## 📱 How to Integrate TADS

### Step 1: Install TADS Widget from [npm](https://www.npmjs.com/package/react-tads-widget)

```bash
npm install react-tads-widget
```

### Step 1.5: Set up TadsWidgetProvider

Wrap your app with `TadsWidgetProvider`:

```tsx
// In your main App.tsx or index.tsx
import { TadsWidgetProvider } from 'react-tads-widget';

function App() {
  return (
    <TadsWidgetProvider>
      {/* Your app components */}
      <YourApp />
    </TadsWidgetProvider>
  );
}
```

### Step 2: Import and Use Widgets

```tsx
import { TadsWidget } from 'react-tads-widget';

// Static ad
<TadsWidget 
  id="YOUR_AD_ID" 
  type="static" 
  onClickReward={() => console.log('Ad clicked!')}
  onAdsNotFound={() => console.log('Do something when ads not found')} 
/>

// Fullscreen ad
<TadsWidget 
  id="YOUR_FULLSCREEN_AD_ID" 
  type="fullscreen" 
  onShowReward={() => console.log('Ad watched!')}
  onAdsNotFound={() => console.log('Do something when ads not found')} 
/>
```

### Step 4: Configure Ad IDs

Replace the placeholder IDs with your actual TADS ad IDs:

```tsx
// In AdsPage.tsx
<TadsWidget id="1" type="static" />      // Your static ad ID
<TadsWidget id="4" type="fullscreen" />  // Your fullscreen ad ID

// In GamePage.tsx  
<TadsWidget id="4" type="fullscreen" />  // Your fullscreen ad ID
```

## 🎨 Customization

### Styling Ads with CSS

```css
/* Customize TADS widget appearance */
#tads-container-1 .tads-image {
  border-radius: 8px;
  width: 48px;
  height: 48px;
}

#tads-container-1 .tads-title {
  font-size: 14px;
  color: #fff;
}

#tads-container-1 .tads-text-wrapper:after {
  content: "+10 🪙";
  position: absolute;
  right: 0;
  background: #22c55e;
  color: #fff;
  border-radius: 16px;
  padding: 8px 10px;
}
```

## 📚 Key Files Structure

```
src/
├── pages/
│   ├── AdsPage/           # TADS integration examples
│   │   ├── AdsPage.tsx    # Static & fullscreen ads
│   │   └── AdsPage.css    # TADS widget styling
│   └── GamePage/          # Game with ad rewards
│       ├── GamePage.tsx   # Fullscreen ad integration
│       └── GamePage.css   # Game-specific styles
├── hooks/
│   └── useUserStats.ts    # Virtual currency management
└── components/
    └── UserHeader/        # Display user stats & coins
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## 📖 Documentation & Resources

- [TADS Official Documentation](https://docs.tads.me/)
- [TADS Registration](https://tads.me/register)
- [Telegram Mini Apps Platform](https://docs.telegram-mini-apps.com/)
- [React TADS Widget](https://www.npmjs.com/package/react-tads-widget)

## 💬 Support & Community

- **Telegram Channel**: [@tadsagency](https://t.me/tadsagency)
- **Documentation**: [docs.tads.me](https://docs.tads.me/)

## ⚠️ Important Notes

1. **Development Mode**: TADS widgets work in development with `debug={true}`
2. **Production**: Set `debug={false}` and use real ad IDs
3. **Testing**: Use Telegram's test environment for development
4. **Monetization**: TADS requires registration and approval

---

**Ready to monetize your Telegram Mini App?** Start with [TADS](https://tads.me/register?source=example&intent=publisher) integration today! 🚀💰
