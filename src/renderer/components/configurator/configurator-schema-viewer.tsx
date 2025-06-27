import { Button } from "@/renderer/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SchemaNode = string | Record<string, any> | [string, any]; // basic type, object, or array

interface ClickableSchemaViewerProps {
  schema: Record<string, SchemaNode>;
  onFieldClick?: (field: string) => void;
  onAddRequired?: (field: string) => void;
  onAddOptional?: (field: string) => void;
  onRemoveField?: (field: string) => void;
  copiedField?: string | null;
  isFieldInAnyList?: (field: string) => boolean;
}

export const ConfiguratorSchemaViewer: React.FC<ClickableSchemaViewerProps> = ({
  schema,
  onFieldClick,
  onAddRequired,
  onAddOptional,
  onRemoveField,
  copiedField,
  isFieldInAnyList,
}) => {
  return (
    <div style={{ fontFamily: "monospace", whiteSpace: "pre" }}>
      <SchemaTree
        node={schema}
        path={[]}
        onFieldClick={onFieldClick}
        onAddRequired={onAddRequired}
        onAddOptional={onAddOptional}
        onRemoveField={onRemoveField}
        copiedField={copiedField}
        isFieldInAnyList={isFieldInAnyList}
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
}) => {
  const handleClick = (fieldPath: string) => {
    if (onFieldClick) {
      onFieldClick(fieldPath);
    }
  };

  if (Array.isArray(node)) {
    const [, inner] = node;
    return (
      <div>
        <span>["array", </span>
        <SchemaTree
          node={inner}
          path={[...path, "[]"]}
          onFieldClick={onFieldClick}
          onAddRequired={onAddRequired}
          onAddOptional={onAddOptional}
          onRemoveField={onRemoveField}
          copiedField={copiedField}
          isFieldInAnyList={isFieldInAnyList}
        />
        <span>]</span>
      </div>
    );
  }

  if (typeof node === "object" && node !== null) {
    return (
      <div style={{ paddingLeft: 12 }}>
        {"{"}
        {Object.entries(node).map(([key, value]) => {
          const currentPath = [...path, key];
          const fieldPath = currentPath.join(".");
          const isLeaf = typeof value === "string";
          const isAlreadyAdded = isFieldInAnyList
            ? isFieldInAnyList(fieldPath)
            : false;

          return (
            <div key={fieldPath} className="flex items-center gap-2">
              <div className="min-w-0 flex-1 text-wrap">
                <span
                  style={{
                    cursor: "pointer",
                    color: copiedField === fieldPath ? "green" : "blue",
                    textDecoration:
                      copiedField === fieldPath ? "underline" : "none",
                  }}
                  onClick={() => handleClick(fieldPath)}
                  title="Click to copy field path"
                >
                  {key}
                </span>
                {": "}
                <SchemaTree
                  node={value}
                  path={currentPath}
                  onFieldClick={onFieldClick}
                  onAddRequired={onAddRequired}
                  onAddOptional={onAddOptional}
                  onRemoveField={onRemoveField}
                  copiedField={copiedField}
                  isFieldInAnyList={isFieldInAnyList}
                />
              </div>
              {isLeaf && (onAddRequired || onAddOptional || onRemoveField) && (
                <div className="ml-2 flex flex-shrink-0 gap-1">
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
                </div>
              )}
            </div>
          );
        })}
        {"}"}
      </div>
    );
  }

  // Primitive value
  return <span>{JSON.stringify(node)}</span>;
};
