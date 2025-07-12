import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { action } from 'storybook/actions';

import { SearchHeader } from './search-header';

const meta: Meta<typeof SearchHeader> = {
  component: SearchHeader,
  title: 'Layouts/SearchHeader',
  tags: ['autodocs'],
  argTypes: {
    searchTerm: { control: 'text' },
    onSearchChange: { action: 'searchChange' },
  },
};

export default meta;

type Story = StoryObj<typeof SearchHeader>;

export const Default: Story = {
  args: {
    searchTerm: '',
    onSearchChange: action('Search Term Changed'),
  },
  render: args => {
    const [term, setTerm] = useState(args.searchTerm);
    const handleChange = (newTerm: string) => {
      setTerm(newTerm);
      args.onSearchChange(newTerm);
    };
    return <SearchHeader {...args} searchTerm={term} onSearchChange={handleChange} />;
  },
};

export const WithInitialTerm: Story = {
  args: {
    ...Default.args,
    searchTerm: 'dashboard',
  },
};
