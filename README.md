# Vibe & Travel Pakistan — redesign

Next.js 16 rebuild of [vibentravelpakistan.com](https://vibentravelpakistan.com) using the same content and images, with a new visual design, GSAP animation and Three.js scenes.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Stack

- **Next.js 16** (App Router, Cache Components, all routes prerendered)
- **Tailwind CSS v4**, with design tokens in `src/app/globals.css`
- **GSAP 3** (ScrollTrigger, SplitText, Flip) via `@gsap/react`
- **Three.js** via `@react-three/fiber` + `drei`
- **Lenis** for smooth scrolling

## Palette: "Karakoram Dusk"

| Token | Hex | Use |
| --- | --- | --- |
| `pine-700` | `#025F32` | Brand green (from the original logo) |
| `night` / `pine-950` | `#05140F` / `#061D15` | Dark immersive sections |
| `glacier-400` | `#4FC7BC` | Accent (glacier lakes such as Attabad) |
| `alpen-400` | `#F7A95C` | Primary CTA (alpenglow on the peaks) |
| `snow` / `sand` | `#F7F4EC` / `#ECE5D6` | Light section backgrounds |

Display type is Manrope 800, with Instrument Serif italic for accent words.

## Where things live

| Path | What |
| --- | --- |
| `src/data/packages.json` | All 15 packages (itinerary, pricing, FAQs, inclusions), extracted from the live site |
| `src/data/site.ts` | Contact details, destinations, hero slides and form options |
| `src/components/three/` | `MountainScene` (procedural Karakoram valley in the hero) and `FloatingIsland` (low-poly 3D island) |
| `src/components/home/` | Homepage sections: 3D card deck, flip tiles, 3D destination ring and others |
| `src/components/forms/` | Custom-trip wizard and contact form |

## Forms

The forms have no backend. On submit they open WhatsApp (`+92 313 6295767`) with a pre-filled message containing every field. To send them to an email or CRM instead, replace the `submit` handlers in `src/components/forms/`.
