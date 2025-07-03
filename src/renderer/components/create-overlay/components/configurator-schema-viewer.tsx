import { Plus, Trash2 } from 'lucide-react';
import type React from 'react';

import { Button } from '../../ui/button';
import { getGameIcon } from '../utils/game-icons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SchemaNode = string | Record<string, any> | [string, any]; // basic type, object, or array

interface ConfiguratorSchemaViewerProps {
  schema: Record<string, SchemaNode>;
  onFieldClick?: (field: string) => void;
  onAddRequired?: (field: string) => void;
  onAddOptional?: (field: string) => void;
  onRemoveField?: (field: string) => void;
  copiedField?: string | null;
  isFieldInAnyList?: (field: string) => boolean;
  getFieldSupportedGames?: (field: string) => string[];
}

export const ConfiguratorSchemaViewer: React.FC<ConfiguratorSchemaViewerProps> = ({
  schema,
  onFieldClick,
  onAddRequired,
  onAddOptional,
  onRemoveField,
  copiedField,
  isFieldInAnyList,
  getFieldSupportedGames,
}) => {
  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>
      <SchemaTree
        node={schema}
        path={[]}
        onFieldClick={onFieldClick}
        onAddRequired={onAddRequired}
        onAddOptional={onAddOptional}
        onRemoveField={onRemoveField}
        copiedField={copiedField}
        isFieldInAnyList={isFieldInAnyList}
        getFieldSupportedGames={getFieldSupportedGames}
      />
    </div>
  );
};

interface SchemaTreeProps {
  node: SchemaNode;
  path: string[];
  onFieldClick?: (field: string) => void;
  onAddRequired?: (field: string) => void;
  onAddOptional?: (field: string) => void;
  onRemoveField?: (field: string) => void;
  copiedField?: string | null;
  isFieldInAnyList?: (field: string) => boolean;
  getFieldSupportedGames?: (field: string) => string[];
}

const SchemaTree: React.FC<SchemaTreeProps> = ({
  node,
  path,
  onFieldClick,
  onAddRequired,
  onAddOptional,
  onRemoveField,
  copiedField,
  isFieldInAnyList,
  getFieldSupportedGames,
}) => {
  const handleClick = (fieldPath: string) => {
    if (onFieldClick) {
      onFieldClick(fieldPath);
    }
  };

  if (Array.isArray(node)) {
    const [, inner] = node as [string, SchemaNode];
    return (
      <div>
        <span>["array", </span>
        <SchemaTree
          node={inner}
          path={[...path, '[]']}
          onFieldClick={onFieldClick}
          onAddRequired={onAddRequired}
          onAddOptional={onAddOptional}
          onRemoveField={onRemoveField}
          copiedField={copiedField}
          isFieldInAnyList={isFieldInAnyList}
          getFieldSupportedGames={getFieldSupportedGames}
        />
        <span>]</span>
      </div>
    );
  }

  if (typeof node === 'object' && node !== null) {
    return (
      <div style={{ paddingLeft: 12 }}>
        {'{'}
        {Object.entries(node).map(([key, value]) => {
          const currentPath = [...path, key];
          // Fix: Generate field path with correct array syntax
          const fieldPath = generateFieldPath(currentPath);
          const isLeaf = typeof value === 'string';
          const isAlreadyAdded = isFieldInAnyList ? isFieldInAnyList(fieldPath) : false;
          const supportedGames = getFieldSupportedGames ? getFieldSupportedGames(fieldPath) : [];

          return (
            <div key={fieldPath} className="my-1 flex items-center gap-2">
              <div className="min-w-0 flex-1 text-wrap">
                <span
                  style={{
                    cursor: 'pointer',
                    color: copiedField === fieldPath ? 'green' : 'blue',
                    textDecoration: copiedField === fieldPath ? 'underline' : 'none',
                  }}
                  onClick={() => handleClick(fieldPath)}
                  title="Click to copy field path"
                >
                  {key}
                </span>
                {': '}
                <SchemaTree
                  node={value as SchemaNode}
                  path={currentPath}
                  onFieldClick={onFieldClick}
                  onAddRequired={onAddRequired}
                  onAddOptional={onAddOptional}
                  onRemoveField={onRemoveField}
                  copiedField={copiedField}
                  isFieldInAnyList={isFieldInAnyList}
                  getFieldSupportedGames={getFieldSupportedGames}
                />
              </div>

              {isLeaf && (
                <div className="ml-2 flex flex-shrink-0 items-center gap-1">
                  {/* Game Support Icons */}
                  {supportedGames.length > 0 && (
                    <div className="flex gap-1">
                      {supportedGames.map(game => (
                        <div key={game} className="text-xs" title={`Supported in ${game}`}>
                          {getGameIcon(game)}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {(onAddRequired || onAddOptional || onRemoveField) && (
                    <>
                      {onAddRequired && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => onAddRequired(fieldPath)}
                          title="Add to Required Fields"
                          disabled={isAlreadyAdded}
                        >
                          <Plus className="h-3 w-3 text-red-600" />
                        </Button>
                      )}

                      {onAddOptional && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => onAddOptional(fieldPath)}
                          title="Add to Optional Fields"
                          disabled={isAlreadyAdded}
                        >
                          <Plus className="h-3 w-3 text-blue-600" />
                        </Button>
                      )}

                      {onRemoveField && isAlreadyAdded && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => onRemoveField(fieldPath)}
                          title="Remove from all lists"
                        >
                          <Trash2 className="h-3 w-3 text-gray-600" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {'}'}
      </div>
    );
  }

  // Primitive value
  return <span>{JSON.stringify(node)}</span>;
};

// Helper function to generate correct field paths
function generateFieldPath(pathArray: string[]): string {
  const result: string[] = [];

  for (let i = 0; i < pathArray.length; i++) {
    const segment = pathArray[i];

    if (segment === '[]') {
      // For array notation, append [] to the previous segment
      if (result.length > 0) {
        result[result.length - 1] += '[]';
      }
    } else {
      result.push(segment);
    }
  }

  return result.join('.');
}
