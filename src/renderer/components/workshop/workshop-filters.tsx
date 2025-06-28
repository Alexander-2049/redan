import { RotateCcw } from 'lucide-react';

import { Button } from '@/renderer/components/ui/button';
import { Checkbox } from '@/renderer/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/renderer/components/ui/select';

interface WorkshopFiltersProps {
  onResetFilters: () => void;
}

export function WorkshopFilters({ onResetFilters }: WorkshopFiltersProps) {
  return (
    <div className="w-64 space-y-4">
      <div className="space-y-2">
        <Button
          onClick={onResetFilters}
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="mb-3 font-medium text-gray-900">Show only:</h3>
          <div className="space-y-1">
            <label className="flex cursor-pointer items-center space-x-3 rounded p-2 transition-colors hover:bg-gray-100">
              <Checkbox
                id="customizable"
                className="border-gray-400 bg-white data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
              />
              <span className="flex-1 text-sm text-gray-700">Customizable</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-medium text-gray-900">Type</h3>
          <div className="space-y-1">
            <label className="flex cursor-pointer items-center space-x-3 rounded p-2 transition-colors hover:bg-gray-100">
              <Checkbox
                id="scene"
                className="border-gray-400 bg-white data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
              />
              <span className="flex-1 text-sm text-gray-700">Scene</span>
            </label>
            <label className="flex cursor-pointer items-center space-x-3 rounded p-2 transition-colors hover:bg-gray-100">
              <Checkbox
                id="video"
                className="border-gray-400 bg-white data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
              />
              <span className="flex-1 text-sm text-gray-700">Video</span>
            </label>
            <label className="flex cursor-pointer items-center space-x-3 rounded p-2 transition-colors hover:bg-gray-100">
              <Checkbox
                id="web"
                className="border-gray-400 bg-white data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
              />
              <span className="flex-1 text-sm text-gray-700">Web</span>
            </label>
            <label className="flex cursor-pointer items-center space-x-3 rounded p-2 transition-colors hover:bg-gray-100">
              <Checkbox
                id="application"
                className="border-gray-400 bg-white data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
              />
              <span className="flex-1 text-sm text-gray-700">Application</span>
            </label>
            <label className="flex cursor-pointer items-center space-x-3 rounded p-2 transition-colors hover:bg-gray-100">
              <Checkbox
                id="wallpaper"
                className="border-gray-400 bg-white data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
              />
              <span className="flex-1 text-sm text-gray-700">Wallpaper</span>
            </label>
            <label className="flex cursor-pointer items-center space-x-3 rounded p-2 transition-colors hover:bg-gray-100">
              <Checkbox
                id="preset"
                className="border-gray-400 bg-white data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
              />
              <span className="flex-1 text-sm text-gray-700">Preset</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-medium text-gray-900">Age rating</h3>
          <Select>
            <SelectTrigger className="border-gray-300 bg-white text-gray-900 hover:bg-gray-50">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="border-gray-300 bg-white">
              <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">
                All
              </SelectItem>
              <SelectItem value="everyone" className="text-gray-900 hover:bg-gray-100">
                Everyone
              </SelectItem>
              <SelectItem value="mature" className="text-gray-900 hover:bg-gray-100">
                Mature
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="mb-3 font-medium text-gray-900">Tags</h3>
          <div className="max-h-80 space-y-1 overflow-y-auto">
            {[
              'Anime',
              'Abstract',
              'Animal',
              'Cartoon',
              'CGI',
              'Cyberpunk',
              'Fantasy',
              'Game',
              'Girls',
              'Landscape',
              'Medieval',
              'Memes',
              'MMD',
              'Music',
              'Nature',
              'Pixel art',
              'Relaxing',
              'Retro',
              'Sci-Fi',
              'Sports',
              'Technology',
              'Television',
            ].map(tag => (
              <label
                key={tag}
                className="flex cursor-pointer items-center space-x-3 rounded p-2 transition-colors hover:bg-gray-100"
              >
                <Checkbox
                  id={tag.toLowerCase()}
                  className="border-gray-400 bg-white data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                />
                <span className="flex-1 text-sm text-gray-700">{tag}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
