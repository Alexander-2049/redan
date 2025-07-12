// Assuming these types are derived from your Zod schemas
// You might need to import them if they are in a separate file, e.g., '@/shared/types/LayoutFile'
// For the purpose of this mock, I'll define the structure directly based on the Zod schema.
interface OverlaySizeInLayoutFile {
  width: number;
  height: number;
}

interface OverlayPositionInLayoutFile {
  x: number;
  y: number;
}

type OverlaySettingValueInLayoutFile = number | string | boolean;

interface OverlaySettingInLayoutFile {
  id: string;
  value: OverlaySettingValueInLayoutFile;
}

interface OverlayInLayoutFile {
  id: string;
  folderName: string;
  baseUrl: string;
  title: string;
  settings: OverlaySettingInLayoutFile[];
  visible: boolean;
  position: OverlayPositionInLayoutFile;
  size: OverlaySizeInLayoutFile;
}

interface ScreenInLayoutFile {
  width: number;
  height: number;
}

interface LayoutFileSchema {
  title: string;
  overlays: OverlayInLayoutFile[];
  screen: ScreenInLayoutFile;
}

// Extend the LayoutFileSchema with filename for the selector component
interface ExtendedLayoutFile extends LayoutFileSchema {
  filename: string;
}

export const mockLayouts: ExtendedLayoutFile[] = [
  {
    filename: 'my-first-layout.json',
    title: 'My First Layout',
    overlays: [
      {
        id: 'text-overlay-1',
        folderName: 'text-overlay',
        baseUrl: 'http://localhost:3000/overlays/text-overlay',
        title: 'Welcome Text',
        settings: [
          { id: 'text', value: 'Welcome to my layout!' },
          { id: 'fontSize', value: 24 },
          { id: 'color', value: '#FFFFFF' },
        ],
        visible: true,
        position: { x: 100, y: 50 },
        size: { width: 400, height: 100 },
      },
      {
        id: 'image-overlay-1',
        folderName: 'image-overlay',
        baseUrl: 'http://localhost:3000/overlays/image-overlay',
        title: 'Logo',
        settings: [{ id: 'imageUrl', value: '/assets/images/logo.png' }],
        visible: true,
        position: { x: 700, y: 20 },
        size: { width: 150, height: 150 },
      },
    ],
    screen: { width: 1920, height: 1080 },
  },
  {
    filename: 'dashboard-layout.json',
    title: 'Dashboard Layout for Racing',
    overlays: [
      {
        id: 'gauge-rpm',
        folderName: 'gauge-overlay',
        baseUrl: 'http://localhost:3000/overlays/gauge-overlay',
        title: 'RPM Gauge',
        settings: [{ id: 'maxRpm', value: 9000 }],
        visible: true,
        position: { x: 50, y: 50 },
        size: { width: 200, height: 200 },
      },
      {
        id: 'map-track',
        folderName: 'map-overlay',
        baseUrl: 'http://localhost:3000/overlays/map-overlay',
        title: 'Track Map',
        settings: [{ id: 'trackId', value: 'nurburgring' }],
        visible: true,
        position: { x: 300, y: 50 },
        size: { width: 300, height: 300 },
      },
      {
        id: 'lap-timer',
        folderName: 'timer-overlay',
        baseUrl: 'http://localhost:3000/overlays/timer-overlay',
        title: 'Lap Timer',
        settings: [{ id: 'precision', value: 3 }],
        visible: true,
        position: { x: 100, y: 400 },
        size: { width: 150, height: 50 },
      },
    ],
    screen: { width: 1920, height: 1080 },
  },
  {
    filename: 'simple-telemetry.json',
    title: 'Simple Telemetry View',
    overlays: [], // No overlays for this one
    screen: { width: 1280, height: 720 },
  },
  {
    filename: 'long-name-example-layout-with-many-words.json',
    title: 'Long Name Example Layout With Many Words',
    overlays: [
      {
        id: 'chart-data',
        folderName: 'chart-overlay',
        baseUrl: 'http://localhost:3000/overlays/chart-overlay',
        title: 'Performance Chart',
        settings: [{ id: 'dataType', value: 'speed' }],
        visible: true,
        position: { x: 10, y: 10 },
        size: { width: 600, height: 400 },
      },
      {
        id: 'data-display',
        folderName: 'data-overlay',
        baseUrl: 'http://localhost:3000/overlays/data-overlay',
        title: 'Live Data',
        settings: [{ id: 'fields', value: 'speed,rpm,gear' }],
        visible: true,
        position: { x: 650, y: 10 },
        size: { width: 200, height: 150 },
      },
      {
        id: 'graph-overlay',
        folderName: 'graph-overlay',
        baseUrl: 'http://localhost:3000/overlays/graph-overlay',
        title: 'Telemetry Graph',
        settings: [{ id: 'graphType', value: 'line' }],
        visible: false, // Example of a hidden overlay
        position: { x: 10, y: 450 },
        size: { width: 800, height: 300 },
      },
    ],
    screen: { width: 1920, height: 1080 },
  },
  {
    filename: 'empty-layout.json',
    title: 'Empty Layout',
    overlays: [],
    screen: { width: 1024, height: 768 },
  },
];
