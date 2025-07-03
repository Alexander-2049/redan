import { ChevronDown, ChevronUp, Copy, Trash2, Settings } from 'lucide-react';
import type React from 'react';
import { useState, useRef } from 'react';

import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';

import { ConfirmDeleteDialog } from './confirm-delete-dialog';
import { SettingForm } from './setting-form';

import type { OverlaySettingDescription } from '@/shared/types/OverlaySettingDescription';

interface SettingItemProps {
  setting: OverlaySettingDescription;
  onUpdate: (setting: OverlaySettingDescription) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

export const SettingItem = ({ setting, onUpdate, onRemove, onDuplicate }: SettingItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const getSettingTypeColor = (type: string) => {
    const colors = {
      slider: 'bg-blue-100 text-blue-800',
      toggle: 'bg-green-100 text-green-800',
      select: 'bg-purple-100 text-purple-800',
      number: 'bg-orange-100 text-orange-800',
      string: 'bg-gray-100 text-gray-800',
      color: 'bg-pink-100 text-pink-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDefaultValueDisplay = () => {
    if (setting.type === 'toggle') {
      return setting.defaultValue ? 'True' : 'False';
    }
    if (setting.type === 'color') {
      return (
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded border"
            style={{ backgroundColor: setting.defaultValue }}
          />
          {setting.defaultValue}
        </div>
      );
    }
    return String(setting.defaultValue);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();

    // Check if Shift key is pressed for immediate deletion
    if (event.shiftKey) {
      onRemove();
    } else {
      setShowDeleteDialog(true);
    }
  };

  const handleDuplicate = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDuplicate();

    // Scroll to the new setting after a short delay to allow for DOM update
    setTimeout(() => {
      if (cardRef.current) {
        const parentContainer = cardRef.current.parentElement;
        if (parentContainer) {
          const allSettings = Array.from(parentContainer.children);
          const currentIndex = allSettings.indexOf(cardRef.current);
          const nextSetting = allSettings[currentIndex + 1] as HTMLElement;

          if (nextSetting) {
            nextSetting.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
        }
      }
    }, 100);
  };

  const handleCardClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    setShowDeleteDialog(false);
    onRemove();
  };

  return (
    <>
      <div ref={cardRef}>
        <Card>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CardHeader
              className={`pb-3 ${!isOpen ? 'hover:bg-muted/50 cursor-pointer transition-colors' : ''}`}
              onClick={!isOpen ? handleCardClick : undefined}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-auto p-0">
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <div className="flex items-center gap-2">
                    <Settings className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">{setting.name}</span>
                    <Badge variant="secondary" className={getSettingTypeColor(setting.type)}>
                      {setting.type}
                    </Badge>
                    {setting.group && (
                      <Badge variant="outline" className="text-xs">
                        {setting.group}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground text-sm">
                    Default Value: {getDefaultValueDisplay()}
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={handleDuplicate}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Duplicate this setting</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete setting (Hold Shift to skip confirmation)</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <SettingForm setting={setting} onUpdate={onUpdate} />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>

      <ConfirmDeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        settingName={setting.name}
      />
    </>
  );
};
