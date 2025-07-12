import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { CreateLayoutButton } from './create-layout-button';

const meta: Meta<typeof CreateLayoutButton> = {
  component: CreateLayoutButton,
  title: 'Layouts/CreateLayoutButton',
  tags: ['autodocs'],
  argTypes: {
    handleCreateLayout: { action: 'createLayout' },
  },
};

export default meta;

type Story = StoryObj<typeof CreateLayoutButton>;

export const Default: Story = {
  args: {
    handleCreateLayout: action('Create New Layout'),
  },
};
