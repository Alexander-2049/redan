import { useQuery } from '@tanstack/react-query';
import { HelpCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Alert, AlertDescription } from '../../ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import { ConfiguratorSchemaViewer } from '../components/configurator-schema-viewer';
import { FieldsList } from '../components/fields-list';
import { mergeSchemas } from '../utils/schema-utils';

import type { GameSchema } from '@/shared/types/GameSchema';
import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

interface FieldsSectionProps {
  manifest: OverlayManifestFile;
  onUpdate: (updates: Partial<OverlayManifestFile>) => void;
}

export const FieldsSection = ({ manifest, onUpdate }: FieldsSectionProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const {
    data: schemas,
    isLoading,
    error,
  } = useQuery<GameSchema[]>({
    queryKey: ['schemas'],
    queryFn: async () => {
      const response = await fetch('http://localhost:42049/schemas');
      if (!response.ok) {
        throw new Error('Failed to fetch schemas');
      }
      return response.json();
    },
  });

  const mergedSchema = schemas ? mergeSchemas(schemas) : {};

  const handleFieldClick = (field: string) => {
    setCopiedField(field);
    void navigator.clipboard.writeText(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAddRequired = (field: string) => {
    if (manifest.requiredFields && !manifest.requiredFields.includes(field)) {
      onUpdate({
        requiredFields: [...manifest.requiredFields, field],
      });
    }
  };

  const handleAddOptional = (field: string) => {
    if (manifest.optionalFields && !manifest.optionalFields.includes(field)) {
      onUpdate({
        optionalFields: [...manifest.optionalFields, field],
      });
    }
  };

  const handleRemoveField = (field: string) => {
    onUpdate({
      requiredFields: (manifest.requiredFields || []).filter(f => f !== field),
      optionalFields: (manifest.optionalFields || []).filter(f => f !== field),
    });
  };

  const isFieldInAnyList = (field: string) => {
    return (
      (manifest.requiredFields || []).includes(field) ||
      (manifest.optionalFields || []).includes(field)
    );
  };

  const getFieldSupportedGames = (field: string): string[] => {
    if (!schemas) return [];

    return schemas
      .filter(schema => {
        const fieldExists = checkFieldExists(schema, field);
        return fieldExists;
      })
      .map(schema => schema.game.replace(/"/g, '')); // Remove quotes from game names
  };

  const checkFieldExists = (schema: GameSchema, fieldPath: string): boolean => {
    const keys = parseFieldPath(fieldPath);
    let current: unknown = schema;

    for (const key of keys) {
      if (key.isArray) {
        // Handle array access like "drivers[]"
        if (
          current &&
          typeof current === 'object' &&
          key.name in current &&
          Array.isArray((current as Record<string, unknown>)[key.name]) &&
          ((current as Record<string, unknown>)[key.name] as unknown[]).length > 1
        ) {
          current = ((current as Record<string, unknown>)[key.name] as unknown[])[1]; // Get the array item schema
        } else {
          return false;
        }
      } else if (current && typeof current === 'object' && key.name in current) {
        current = (current as Record<string, unknown>)[key.name];
      } else {
        return false;
      }
    }

    return current !== undefined;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading Game Schemas...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fields Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load game schemas. Please make sure the server is running on
              http://localhost:42049
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Fields Configuration
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="text-muted-foreground h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Configure which game data fields your overlay requires or optionally uses</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Schema Tree */}
          <div>
            <h3 className="mb-4 text-lg font-medium">Available Fields</h3>
            <div className="bg-muted/20 max-h-96 overflow-auto rounded-lg border p-4">
              <ConfiguratorSchemaViewer
                schema={mergedSchema}
                onFieldClick={handleFieldClick}
                onAddRequired={handleAddRequired}
                onAddOptional={handleAddOptional}
                onRemoveField={handleRemoveField}
                copiedField={copiedField}
                isFieldInAnyList={isFieldInAnyList}
                getFieldSupportedGames={getFieldSupportedGames}
              />
            </div>
          </div>

          {/* Fields Lists */}
          <div className="space-y-4">
            <FieldsList
              title="Required Fields"
              description="Fields that must be available for the overlay to work"
              fields={manifest.requiredFields || []}
              onRemove={field =>
                onUpdate({
                  requiredFields: (manifest.requiredFields || []).filter(f => f !== field),
                })
              }
              getFieldSupportedGames={getFieldSupportedGames}
              variant="required"
            />

            <FieldsList
              title="Optional Fields"
              description="Fields that enhance functionality but aren't required"
              fields={manifest.optionalFields || []}
              onRemove={field =>
                onUpdate({
                  optionalFields: (manifest.optionalFields || []).filter(f => f !== field),
                })
              }
              getFieldSupportedGames={getFieldSupportedGames}
              variant="optional"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to parse field paths with correct array syntax
function parseFieldPath(fieldPath: string): Array<{ name: string; isArray: boolean }> {
  const segments = fieldPath.split('.');
  const result: Array<{ name: string; isArray: boolean }> = [];

  for (const segment of segments) {
    if (segment.endsWith('[]')) {
      // Handle array notation like "drivers[]"
      const name = segment.slice(0, -2);
      result.push({ name, isArray: true });
    } else {
      result.push({ name: segment, isArray: false });
    }
  }

  return result;
}
