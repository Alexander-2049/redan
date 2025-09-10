import { Settings, RotateCcw } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { iconMap } from './components/icons/icon-map';
import { ResetConfirmationModal } from './components/reset-confirmation-model';
import { SettingsGroup } from './components/setting-group';
import SettingsOverlayPreview from './components/settings-overlay-preview';

import { OverlayManifestPage } from '@/main/shared/schemas/overlay-manifest-file-schema';
import { LayoutOverlay } from '@/main/shared/types/LayoutOverlay';
import { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

export type AcceptedValueTypes = string | number | boolean | string[];

interface SettingsInterfaceProps {
  manifest: OverlayManifestFile;
  settingValues: Record<string, AcceptedValueTypes>;
  setSettingValues: Dispatch<SetStateAction<Record<string, AcceptedValueTypes>>>;
  overlay: LayoutOverlay;
}

export function SettingsInterface({
  manifest,
  settingValues,
  setSettingValues,
  overlay,
}: SettingsInterfaceProps) {
  const [activeTab, setActiveTab] = useState(manifest.pages[0]?.title || '');
  const [showResetModal, setShowResetModal] = useState(false);
  const [settingsAsQueryParams, setSettingsAsQueryParams] = useState<string>('');

  useEffect(() => {
    const keys = Object.keys(settingValues);
    let result = '';
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = settingValues[key];

      if (typeof value === 'boolean') {
        result += `&${encodeURIComponent(key)}=${value ? 'true' : 'false'}`;
      }
      if (typeof value === 'number' || typeof value === 'string') {
        result += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }
      if (Array.isArray(value)) {
        result += `&${encodeURIComponent(key)}=${value.map(v => encodeURIComponent(v)).join(',')}`;
      }
    }
    setSettingsAsQueryParams(result);
  }, [settingValues]);

  const handleSettingChange = (settingId: string, value: AcceptedValueTypes) => {
    setSettingValues(prev => ({ ...prev, [settingId]: value }));
  };

  const getAllDefaultValues = () => {
    const defaults: Record<string, AcceptedValueTypes> = {};

    manifest.pages.forEach(page => {
      page.groups.forEach(group => {
        if (group.type === 'default') {
          group.settings.forEach(setting => {
            defaults[setting.id] = setting.defaultValue;
          });
        } else {
          // For reorderable groups, store default order
          defaults[group.id] = group.elements.map(e => e.id);

          // Add element visibility defaults
          group.elements.forEach(element => {
            if (element.visibility) {
              defaults[element.visibility.id] = element.visibility.defaultValue;
            }
            // Add element sub-settings defaults
            if (element.settings) {
              element.settings.forEach(setting => {
                defaults[setting.id] = setting.defaultValue;
              });
            }
          });
        }
      });
    });

    return defaults;
  };

  const isAllDefault = () => {
    const defaults = getAllDefaultValues();
    const currentKeys = Object.keys(settingValues);
    const defaultKeys = Object.keys(defaults);

    // Check if all current values match defaults
    for (const key of currentKeys) {
      if (JSON.stringify(settingValues[key]) !== JSON.stringify(defaults[key])) {
        return false;
      }
    }

    // Check if any default values are missing from current values
    for (const key of defaultKeys) {
      if (!(key in settingValues)) {
        return false;
      }
    }

    return true;
  };

  const handleResetAll = () => {
    const defaults = getAllDefaultValues();
    setSettingValues(defaults);
    setShowResetModal(false);
  };

  const activePage = manifest.pages.find(page => page.title === activeTab);

  const getTabIcon = (page: OverlayManifestPage) => {
    // If page has a specific icon, use it
    if (page.icon) {
      return iconMap[page.icon] || Settings;
    }

    return Settings;
  };

  return (
    <div className="m-16 h-full">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-blue-600 p-3">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{manifest.title}</h1>
                {manifest.description && (
                  <p className="mt-1 text-gray-600">{manifest.description}</p>
                )}
              </div>
            </div>

            {/* Reset All Button */}
            <button
              onClick={() => setShowResetModal(true)}
              disabled={isAllDefault()}
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:cursor-pointer ${
                isAllDefault()
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset All Settings</span>
            </button>
          </div>
        </div>

        {manifest.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {manifest.tags.map((tag, index) => (
              <span
                key={`${index}${tag}`}
                className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dimensions Info */}
      <div className="mx-auto mb-8 max-w-6xl rounded-xl border border-gray-200 bg-white p-4 px-4 shadow-sm">
        <h3 className="mb-3 font-semibold text-gray-900">Overlay Dimensions</h3>
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div>
            <span className="text-gray-500">Default:</span>
            <span className="ml-2 font-mono">
              {manifest.dimentions.defaultWidth}×{manifest.dimentions.defaultHeight}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Min:</span>
            <span className="ml-2 font-mono">
              {manifest.dimentions.minWidth}×{manifest.dimentions.minHeight}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Max:</span>
            <span className="ml-2 font-mono">
              {manifest.dimentions.maxWidth}×{manifest.dimentions.maxHeight}
            </span>
          </div>
        </div>
      </div>

      {/* Overlay Preview */}
      <div>
        <p className="max-w-3xl wrap-break-word">{`${overlay.baseUrl}?preview=true${settingsAsQueryParams}`}</p>
        <SettingsOverlayPreview
          defaultHeight={manifest.dimentions.defaultHeight}
          defaultWidth={manifest.dimentions.defaultWidth}
          iframeUrl={`${overlay.baseUrl}?preview=true${settingsAsQueryParams}`}
          backgroundImageUrl="https://t3.ftcdn.net/jpg/03/09/04/12/360_F_309041299_fucpREMWXjdBrghlPefPXLAYrgkbn1FJ.jpg"
          parentHeight={300}
        />
      </div>

      {/* Tabs */}
      <div className="mx-auto mb-8 max-w-6xl">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {manifest.pages.map(page => {
              const Icon = getTabIcon(page);
              const isActive = activeTab === page.title;
              return (
                <button
                  key={`page-${page.title}`}
                  onClick={() => setActiveTab(page.title)}
                  className={`group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium transition-colors hover:cursor-pointer ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Icon
                    className={`mr-2 h-5 w-5 ${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {page.title}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Settings Content */}
      {activePage && (
        <div>
          {activePage.groups.map(group => (
            <SettingsGroup
              key={`group-${group.title}-${group.type}`}
              group={group}
              settingValues={settingValues}
              onSettingChange={handleSettingChange}
              manifest={manifest}
            />
          ))}
        </div>
      )}

      {/* Reset Confirmation Modal */}
      <ResetConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetAll}
      />
    </div>
  );
}
