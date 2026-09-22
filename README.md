# TADS examples

Working Telegram Mini Apps with [TADS](https://tads.me/publisher?source=example&intent=publisher) ads inside. Clone, put your widget ID in, open in Telegram.

| Example | Stack | What it shows | Live |
| --- | --- | --- | --- |
| [react](react/) | Vite + React + TypeScript, based on [Telegram-Mini-Apps/reactjs-template](https://github.com/Telegram-Mini-Apps/reactjs-template) | Stick Hero game: rewarded fullscreen ad for a free restart, Text-Graphic Block with a click reward, coins wallet | [TADS-me.github.io/tads-examples](https://TADS-me.github.io/tads-examples/) |

## Add TADS to your own app in 3 steps

1. Sign up at [tads.me](https://tads.me/register?source=example&intent=publisher), add your Mini App under Publisher → Sites, create a widget under Publisher → Widgets and copy its ID.
2. `npm install react-tads-widget`, wrap the app in `<TadsWidgetProvider>`, render `<TadsWidget id="YOUR_WIDGET_ID" type="static" />` where the ad goes. For a fullscreen ad render `<TadsWidget id="…" type="fullscreen" onShowReward={…} />` and call `renderTadsWidget({ id: '…', type: 'fullscreen' })` from a button. Plain JS, Vue, Svelte: load `https://w.tads.me/widget.js` and call `window.tads.init(...)`.
3. Open the app inside Telegram. Outside Telegram the SDK shows test ads and counts nothing.

Using an AI coding agent? Install the skill and ask it to add TADS ads:

```bash
npx skills add TADS-me/skills
```

## Links

- Agent-readable docs: [tads.me/llms.txt](https://tads.me/llms.txt), full: [tads.me/llms-full.txt](https://tads.me/llms-full.txt)
- Docs for humans: [tads.gitbook.io/docs](https://tads.gitbook.io/docs/getting-started/publishers)
- Support: [@tads_manager](https://t.me/tads_manager)
