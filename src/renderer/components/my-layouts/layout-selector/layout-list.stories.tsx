import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { action } from 'storybook/actions';

import { LayoutList } from './layout-list';
import { mockLayouts } from './mock-data';

const meta: Meta<typeof LayoutList> = {
  component: LayoutList,
  title: 'Layouts/LayoutList',
  tags: ['autodocs'],
  argTypes: {
    layouts: { control: 'object' },
    activeLayoutFilename: { control: 'text' },
    handleDeleteLayout: { action: 'deleteLayout' },
    handleRenameLayout: { action: 'renameLayout' },
    handleReorderLayouts: { action: 'reorderLayouts' },
  },
};

export default meta;

type Story = StoryObj<typeof LayoutList>;

export const Default: Story = {
  args: {
    layouts: mockLayouts,
    activeLayoutFilename: mockLayouts[0].filename,
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
      const reordered = newOrder
        .map(filename => currentLayouts.find(l => l.filename === filename))
        .filter(Boolean);
      setCurrentLayouts(reordered as typeof currentLayouts);
    };

    const handleDelete = (filename: string) => {
      action('Delete Layout')(filename);
      setCurrentLayouts(prev => prev.filter(l => l.filename !== filename));
    };

    const handleRename = (filename: string, newTitle: string) => {
      action('Rename Layout')(filename, newTitle);
      setCurrentLayouts(prev =>
        prev.map(l => (l.filename === filename ? { ...l, title: newTitle } : l)),
      );
    };

    return (
      <div className="h-[400px] w-[240px] overflow-y-auto border">
        <LayoutList
          {...args}
          layouts={currentLayouts}
          activeLayoutFilename={activeLayout}
          handleReorderLayouts={handleReorder}
          handleDeleteLayout={handleDelete}
          handleRenameLayout={handleRename}
        />
      </div>
    );
  },
};

export const EmptyList: Story = {
  args: {
    ...Default.args,
    layouts: [],
    activeLayoutFilename: undefined,
  },
};

export const WithManyItems: Story = {
  args: {
    ...Default.args,
    layouts: Array.from({ length: 20 }, (_, i) => ({
      filename: `layout-${i + 1}.json`,
      title: `Layout ${i + 1}`,
      overlays:
        i % 3 === 0
          ? [
              {
                id: `overlay-${i}`,
                folderName: 'mockFolder',
                baseUrl: 'http://localhost:3000',
                title: `Overlay ${i}`,
                settings: [],
                visible: true,
                position: { x: 100, y: 100 },
                size: { width: 300, height: 200 },
              },
            ]
          : [],
      screen: { width: 1920, height: 1080 },
    })),
  },
};
