import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';

import { LayoutSelector } from './layout-selector';
import { mockLayouts } from './layout-selector/mock-data';

const meta: Meta<typeof LayoutSelector> = {
  component: LayoutSelector,
  title: 'Layouts/LayoutSelector',
  tags: ['autodocs'],
  argTypes: {
    layouts: { control: 'object' },
    activeLayoutFilename: { control: 'text' },
    handleCreateLayout: { action: 'createLayout' },
    handleDeleteLayout: { action: 'deleteLayout' },
    handleRenameLayout: { action: 'renameLayout' },
    handleReorderLayouts: { action: 'reorderLayouts' },
  },
};

export default meta;

type Story = StoryObj<typeof LayoutSelector>;

export const Default: Story = {
  args: {
    layouts: mockLayouts,
    activeLayoutFilename: mockLayouts[0].filename,
    handleCreateLayout: action('Create Layout'),
    handleDeleteLayout: action('Delete Layout'),
    handleRenameLayout: action('Rename Layout'),
    handleReorderLayouts: action('Reorder Layouts'),
  },
  render: args => {
    // This wrapper demonstrates how the parent component would manage the layouts state
    const [currentLayouts, setCurrentLayouts] = useState(args.layouts);
    const [activeLayout, setActiveLayout] = useState(args.activeLayoutFilename);

    const handleReorder = (newOrder: string[]) => {
      action('Reorder Layouts')(newOrder);
      // Reconstruct layouts based on new order
      const reordered = newOrder
        .map(filename => currentLayouts?.find(l => l.filename === filename))
        .filter(Boolean); // Filter out any undefined if a filename isn't found
      setCurrentLayouts(reordered as typeof currentLayouts);
    };

    const handleDelete = (filename: string) => {
      action('Delete Layout')(filename);
      setCurrentLayouts(prev => prev?.filter(l => l.filename !== filename));
    };

    const handleRename = (filename: string, newTitle: string) => {
      action('Rename Layout')(filename, newTitle);
      setCurrentLayouts(prev =>
        prev?.map(l => (l.filename === filename ? { ...l, title: newTitle } : l)),
      );
    };

    const handleCreate = () => {
      action('Create Layout')();
      const newFilename = `new-layout-${Date.now()}.json`;
      const newLayout = {
        filename: newFilename,
        title: `New Layout ${(currentLayouts?.length || 0) + 1}`,
        overlays: [],
        screen: { width: 1920, height: 1080 },
      };
      setCurrentLayouts(prev => {
        if (prev) return [...prev, newLayout];
        return [newLayout];
      });
      setActiveLayout(newFilename);
    };

    return (
      <div className="h-[600px] w-[240px] border">
        <LayoutSelector
          {...args}
          layouts={currentLayouts}
          activeLayoutFilename={activeLayout}
          handleReorderLayouts={handleReorder}
          handleDeleteLayout={handleDelete}
          handleRenameLayout={handleRename}
          handleCreateLayout={handleCreate}
        />
      </div>
    );
  },
};

export const NoLayouts: Story = {
  args: {
    ...Default.args,
    layouts: [],
    activeLayoutFilename: undefined,
  },
};

export const WithLongTitles: Story = {
  args: {
    ...Default.args,
    layouts: [
      {
        filename: 'very-very-very-long-layout-name-that-should-definitely-truncate.json',
        title: 'Very Very Very Long Layout Name That Should Definitely Truncate',
        screen: { width: 1920, height: 1080 },
        overlays: [
          {
            id: '1',
            folderName: 'text',
            baseUrl: '/overlays/text',
            title: 'Text Overlay',
            settings: [],
            visible: true,
            position: { x: 100, y: 200 },
            size: { width: 300, height: 100 },
          },
        ],
      },
      {
        filename: 'another-extremely-long-title-to-test-truncation-and-hover-effects.json',
        title: 'Another Extremely Long Title To Test Truncation And Hover Effects',
        screen: { width: 1920, height: 1080 },
        overlays: [
          {
            id: '1',
            folderName: 'gauge',
            baseUrl: '/overlays/gauge',
            title: 'Gauge Overlay',
            settings: [],
            visible: true,
            position: { x: 50, y: 150 },
            size: { width: 200, height: 200 },
          },
          {
            id: '2',
            folderName: 'map',
            baseUrl: '/overlays/map',
            title: 'Map Overlay',
            settings: [],
            visible: true,
            position: { x: 400, y: 150 },
            size: { width: 300, height: 300 },
          },
        ],
      },
    ],
  },
};
