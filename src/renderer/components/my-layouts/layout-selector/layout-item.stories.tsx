import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { action } from 'storybook/actions';

import { LayoutItem } from './layout-item';
import { mockLayouts } from './mock-data';

const meta: Meta<typeof LayoutItem> = {
  component: LayoutItem,
  title: 'Layouts/LayoutItem',
  tags: ['autodocs'],
  argTypes: {
    layout: { control: 'object' },
    index: { control: 'number' },
    isActive: { control: 'boolean' },
    draggedItemIndex: { control: 'number' },
    onDragStart: { action: 'dragStart' },
    onDragOver: { action: 'dragOver' },
    onDrop: { action: 'drop' },
    onDragEnd: { action: 'dragEnd' },
    handleDeleteLayout: { action: 'deleteLayout' },
    handleRenameLayout: { action: 'renameLayout' },
  },
};

export default meta;

type Story = StoryObj<typeof LayoutItem>;

export const Default: Story = {
  args: {
    layout: mockLayouts[0],
    index: 0,
    isActive: false,
    draggedItemIndex: null,
    onDragStart: action('Drag Start'),
    onDragOver: action('Drag Over'),
    onDrop: action('Drop'),
    onDragEnd: action('Drag End'),
    handleDeleteLayout: action('Delete Layout'),
    handleRenameLayout: action('Rename Layout'),
  },
};

export const Active: Story = {
  args: {
    ...Default.args,
    isActive: true,
  },
};

export const WithManyOverlays: Story = {
  args: {
    ...Default.args,
    layout: mockLayouts[3],
  },
};

export const LongTitle: Story = {
  args: {
    ...Default.args,
    layout: {
      ...mockLayouts[0],
      title: 'This is a very very very long layout title that should truncate nicely',
    },
  },
};

export const EditingTitle: Story = {
  args: {
    ...Default.args,
    layout: {
      ...mockLayouts[0],
      title: 'Layout being edited',
    },
  },
  render: args => {
    // This wrapper simulates the internal state of LayoutItem for editing
    const [currentTitle, setCurrentTitle] = useState(args.layout.title);

    const handleRename = (filename: string, newTitle: string) => {
      action('Rename Layout')(filename, newTitle);
      setCurrentTitle(newTitle);
    };

    return (
      <div className="w-[240px]">
        {' '}
        {/* Provide a fixed width for context */}
        <LayoutItem
          {...args}
          layout={{ ...args.layout, title: currentTitle }}
          handleRenameLayout={handleRename}
        />
      </div>
    );
  },
};
