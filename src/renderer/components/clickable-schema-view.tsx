import React, { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SchemaNode = string | Record<string, any> | [string, any]; // basic type, object, or array

interface ClickableSchemaViewerProps {
  schema: Record<string, SchemaNode>;
}

export const ClickableSchemaViewer: React.FC<ClickableSchemaViewerProps> = ({ schema }) => {
  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>
      <SchemaTree node={schema} path={[]} />
    </div>
  );
};

interface SchemaTreeProps {
  node: SchemaNode;
  path: string[];
}

const SchemaTree: React.FC<SchemaTreeProps> = ({ node, path }) => {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const copyToClipboard = (fieldPath: string) => {
    navigator.clipboard.writeText(fieldPath);
    setCopiedPath(fieldPath);
    setTimeout(() => setCopiedPath(null), 1000); // reset after 1s
  };

  if (Array.isArray(node)) {
    const [, inner] = node;
    return (
      <div>
        <span>["array", </span>
        <SchemaTree node={inner} path={[...path, '[]']} />
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
          const fieldPath = currentPath.join('.');
          return (
            <div key={fieldPath}>
              <span
                style={{
                  cursor: 'pointer',
                  color: copiedPath === fieldPath ? 'green' : 'blue',
                }}
                onClick={() => copyToClipboard(fieldPath)}
              >
                {key}
              </span>
              {': '}
              <SchemaTree node={value} path={currentPath} />
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
