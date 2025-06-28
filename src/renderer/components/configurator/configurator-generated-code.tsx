/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

import { MappedGameData } from '@/main/_/game-data/types/game-data-schema';
import { GameName } from '@/main/_/game-data/types/game-name-schema';
import { OverlayManifest } from '@/main/_/overlay-service/types';
import { Badge } from '@/renderer/components/ui/badge';
import { Button } from '@/renderer/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/renderer/components/ui/card';
import { Label } from '@/renderer/components/ui/label';
import { Textarea } from '@/renderer/components/ui/textarea';

interface GeneratedCodeProps {
  manifestData: OverlayManifest;
  schemas: [GameName, MappedGameData][];
}

export const ConfiguratorGeneratedCode: React.FC<GeneratedCodeProps> = ({
  manifestData,
  schemas: gameSchemas,
}) => {
  const [generatedHook, setGeneratedHook] = useState<string>('');

  const generateTypedHookCode = () => {
    const requiredFields = manifestData.requiredFields;
    const optionalFields = manifestData.optionalFields;
    const allFields = [...requiredFields, ...optionalFields];
    const fieldsString = allFields.map(field => `"${field}"`).join(', ');

    // Parse field paths to create nested interfaces
    const parseFieldPaths = (fields: string[]) => {
      const structure: any = {};

      fields.forEach(field => {
        const parts = field.split('.');
        let current = structure;

        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }

        const lastPart = parts[parts.length - 1];
        const isOptional = optionalFields.includes(field);
        const fieldType = generateFieldType(field);

        current[lastPart] = {
          type: isOptional ? `${fieldType} | null` : fieldType,
          optional: isOptional,
        };
      });

      return structure;
    };

    // Generate TypeScript interfaces from structure
    const generateInterfaces = (structure: any, interfaceName = 'OverlayData'): string => {
      let interfaces = '';
      const properties: string[] = [];

      Object.entries(structure).forEach(([key, value]: [string, any]) => {
        if (value.type) {
          // Leaf property
          const optional = value.optional ? '?' : '';
          properties.push(`  ${key}${optional}: ${value.type};`);
        } else {
          // Nested object - always create a proper interface
          const nestedInterfaceName = key.charAt(0).toUpperCase() + key.slice(1);
          const nestedInterface = generateInterfaces(value, nestedInterfaceName);
          interfaces += nestedInterface + '\n';
          properties.push(`  ${key}: ${nestedInterfaceName};`);
        }
      });

      return `interface ${interfaceName} {\n${properties.join('\n')}\n}${interfaces ? '\n' + interfaces : ''}`;
    };

    // Generate field type inference
    const generateFieldType = (field: string): string => {
      const fieldLower = field.toLowerCase();
      if (
        fieldLower.includes('time') ||
        fieldLower.includes('temp') ||
        fieldLower.includes('speed') ||
        fieldLower.includes('rpm') ||
        fieldLower.includes('gear') ||
        fieldLower.includes('fuel') ||
        fieldLower.includes('throttle') ||
        fieldLower.includes('brake') ||
        fieldLower.includes('position') ||
        fieldLower.includes('rating') ||
        fieldLower.includes('pct') ||
        fieldLower.includes('dist') ||
        fieldLower.includes('lap') ||
        fieldLower.includes('delta')
      )
        return 'number';
      if (
        fieldLower.includes('name') ||
        fieldLower.includes('string') ||
        fieldLower.includes('class') ||
        fieldLower.includes('lic') ||
        fieldLower.includes('units')
      )
        return 'string';
      if (
        fieldLower.includes('active') ||
        fieldLower.includes('track') ||
        fieldLower.includes('replay') ||
        fieldLower.includes('ok')
      )
        return 'boolean';
      return 'unknown';
    };

    // Build nested object from flat field paths
    const buildNestedObject = (fields: string[]) => {
      const result: any = {};

      fields.forEach(field => {
        const parts = field.split('.');
        let current = result;

        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }

        current[parts[parts.length - 1]] = `data["${field}"]`;
      });

      return result;
    };

    // Generate object construction code
    const generateObjectConstruction = (obj: any, indent = '    '): string => {
      const entries = Object.entries(obj).map(([key, value]) => {
        if (typeof value === 'object' && value !== null && !value.toString().startsWith('data[')) {
          return `${indent}${key}: {\n${generateObjectConstruction(value, indent + '  ')}\n${indent}}`;
        } else {
          // Add type assertion for the field
          const fieldPath = (value as string).toString().replace('data["', '').replace('"]', '');
          const fieldType = generateFieldType(fieldPath);
          const isOptional = optionalFields.includes(fieldPath);

          if (isOptional) {
            return `${indent}${key}: ${value} as ${fieldType} | null`;
          } else {
            return `${indent}${key}: ${value} as ${fieldType}`;
          }
        }
      });

      return entries.join(',\n');
    };

    const structure = parseFieldPaths(allFields);
    const interfaces = generateInterfaces(structure);
    const objectStructure = buildNestedObject(allFields);
    const objectConstruction = generateObjectConstruction(objectStructure);

    const hookCode = `import { useEffect, useRef, useState } from "react";

${interfaces}

const useOverlayData = () => {
  const url = "ws://localhost:49791";
  const params = [${fieldsString}];
  const requiredFields = [${requiredFields.map(f => `"${f}"`).join(', ')}];

  const [data, setData] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isUnmounted = false;

    const connect = () => {
      const isPreview = /\\bpreview(\\b|=true)/.test(window.location.search);
      const queryParams = \`?preview=\${isPreview ? "true" : "false"}&q=\${params.join(",")}\`;
      const ws = new WebSocket(\`\${url}\${queryParams}\`);
      socketRef.current = ws;

      ws.onopen = () => {
        if (!isUnmounted) setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (
            message.success &&
            Array.isArray(message.data)
          ) {
            const updatedData: Record<string, unknown> = { ...data };
            
            message.data.forEach(([key, value]: [string, unknown]) => {
              if (params.includes(key)) {
                updatedData[key] = value;
              }
            });
            
            setData(updatedData);
          } else if (message.errorMessage) {
            setError(message.errorMessage);
          }
        } catch {
          setError("Failed to parse WebSocket message");
        }
      };

      ws.onerror = () => {
        if (!isUnmounted) setError("WebSocket error occurred");
      };

      ws.onclose = () => {
        if (!isUnmounted) {
          reconnectTimeoutRef.current = setTimeout(connect, 5000);
        }
      };
    };

    connect();

    return () => {
      isUnmounted = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      socketRef.current?.close();
    };
  }, []);

  // Check if all required fields are available
  const hasAllRequiredFields = requiredFields.every(field => data[field] !== undefined && data[field] !== null);
  
  if (!hasAllRequiredFields) {
    return { data: null, error };
  }

  // Build typed data object
  const typedData: OverlayData = {
${objectConstruction}
  };

  return { data: typedData, error };
};

export default useOverlayData;

// Usage example:
// const { data, error } = useOverlayData();
// 
// data will be null until all required fields are received
// Once available, data will have the structure:
${allFields.map(field => `// data.${field} // ${generateFieldType(field)}${optionalFields.includes(field) ? ' | null' : ''}`).join('\n')}`;

    setGeneratedHook(hookCode);
  };

  // Add new generation functions
  const generatePlainTypeScript = () => {
    const requiredFields = manifestData.requiredFields;
    const optionalFields = manifestData.optionalFields;
    const allFields = [...requiredFields, ...optionalFields];
    const fieldsString = allFields.map(field => `"${field}"`).join(', ');

    // Reuse the same interface generation logic
    const parseFieldPaths = (fields: string[]) => {
      const structure: any = {};

      fields.forEach(field => {
        const parts = field.split('.');
        let current = structure;

        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }

        const lastPart = parts[parts.length - 1];
        const isOptional = optionalFields.includes(field);
        const fieldType = generateFieldType(field);

        current[lastPart] = {
          type: isOptional ? `${fieldType} | null` : fieldType,
          optional: isOptional,
        };
      });

      return structure;
    };

    const generateInterfaces = (structure: any, interfaceName = 'OverlayData'): string => {
      let interfaces = '';
      const properties: string[] = [];

      Object.entries(structure).forEach(([key, value]: [string, any]) => {
        if (value.type) {
          const optional = value.optional ? '?' : '';
          properties.push(`  ${key}${optional}: ${value.type};`);
        } else {
          // Nested object - always create a proper interface
          const nestedInterfaceName = key.charAt(0).toUpperCase() + key.slice(1);
          const nestedInterface = generateInterfaces(value, nestedInterfaceName);
          interfaces += nestedInterface + '\n';
          properties.push(`  ${key}: ${nestedInterfaceName};`);
        }
      });

      return `interface ${interfaceName} {\n${properties.join('\n')}\n}${interfaces ? '\n' + interfaces : ''}`;
    };

    const generateFieldType = (field: string): string => {
      const fieldLower = field.toLowerCase();
      if (
        fieldLower.includes('time') ||
        fieldLower.includes('temp') ||
        fieldLower.includes('speed') ||
        fieldLower.includes('rpm') ||
        fieldLower.includes('gear') ||
        fieldLower.includes('fuel') ||
        fieldLower.includes('throttle') ||
        fieldLower.includes('brake') ||
        fieldLower.includes('position') ||
        fieldLower.includes('rating') ||
        fieldLower.includes('pct') ||
        fieldLower.includes('dist') ||
        fieldLower.includes('lap') ||
        fieldLower.includes('delta')
      )
        return 'number';
      if (
        fieldLower.includes('name') ||
        fieldLower.includes('string') ||
        fieldLower.includes('class') ||
        fieldLower.includes('lic') ||
        fieldLower.includes('units')
      )
        return 'string';
      if (
        fieldLower.includes('active') ||
        fieldLower.includes('track') ||
        fieldLower.includes('replay') ||
        fieldLower.includes('ok')
      )
        return 'boolean';
      return 'unknown';
    };

    const buildNestedObject = (fields: string[]) => {
      const result: any = {};

      fields.forEach(field => {
        const parts = field.split('.');
        let current = result;

        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }

        current[parts[parts.length - 1]] = `this.data["${field}"]`;
      });

      return result;
    };

    const generateObjectConstruction = (obj: any, indent = '      '): string => {
      const entries = Object.entries(obj).map(([key, value]) => {
        if (
          typeof value === 'object' &&
          value !== null &&
          !value.toString().startsWith('this.data[')
        ) {
          return `${indent}${key}: {\n${generateObjectConstruction(value, indent + '  ')}\n${indent}}`;
        } else {
          // Add type assertion for the field
          const fieldPath = (value as string)
            .toString()
            .replace('this.data["', '')
            .replace('"]', '');
          const fieldType = generateFieldType(fieldPath);
          const isOptional = optionalFields.includes(fieldPath);

          if (isOptional) {
            return `${indent}${key}: ${value} as ${fieldType} | null`;
          } else {
            return `${indent}${key}: ${value} as ${fieldType}`;
          }
        }
      });

      return entries.join(',\n');
    };

    const structure = parseFieldPaths(allFields);
    const interfaces = generateInterfaces(structure);
    const objectStructure = buildNestedObject(allFields);
    const objectConstruction = generateObjectConstruction(objectStructure);

    const classCode = `${interfaces}

class OverlayDataManager {
    private url = "ws://localhost:49791";
    private params = [${fieldsString}];
    private requiredFields = [${requiredFields.map(f => `"${f}"`).join(', ')}];
    private data: Record<string, unknown> = {};
    private socket: WebSocket | null = null;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private listeners: Array<(data: OverlayData | null, error: string | null) => void> = [];

    constructor() {
        this.connect();
    }

    private connect(): void {
        const isPreview = typeof window !== 'undefined' && /\\bpreview(\\b|=true)/.test(window.location.search);
        const queryParams = \`?preview=\${isPreview ? "true" : "false"}&q=\${this.params.join(",")}\`;
        this.socket = new WebSocket(\`\${this.url}\${queryParams}\`);

        this.socket.onopen = () => {
            this.notifyListeners(this.getTypedData(), null);
        };

        this.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.success && Array.isArray(message.data)) {
                    message.data.forEach(([key, value]: [string, unknown]) => {
                        if (this.params.includes(key)) {
                            this.data[key] = value;
                        }
                    });
                    this.notifyListeners(this.getTypedData(), null);
                } else if (message.errorMessage) {
                    this.notifyListeners(null, message.errorMessage);
                }
            } catch {
                this.notifyListeners(null, "Failed to parse WebSocket message");
            }
        };

        this.socket.onerror = () => {
            this.notifyListeners(null, "WebSocket error occurred");
        };

        this.socket.onclose = () => {
            this.reconnectTimeout = setTimeout(() => this.connect(), 5000);
        };
    }

    private getTypedData(): OverlayData | null {
        const hasAllRequiredFields = this.requiredFields.every(field => 
            this.data[field] !== undefined && this.data[field] !== null
        );
        
        if (!hasAllRequiredFields) {
            return null;
        }

        return {
${objectConstruction}
        };
    }

    public subscribe(callback: (data: OverlayData | null, error: string | null) => void): () => void {
        this.listeners.push(callback);
        // Immediately call with current data
        callback(this.getTypedData(), null);
        
        // Return unsubscribe function
        return () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    private notifyListeners(data: OverlayData | null, error: string | null): void {
        this.listeners.forEach(callback => callback(data, error));
    }

    public disconnect(): void {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }
        this.socket?.close();
        this.listeners = [];
    }
}

export default OverlayDataManager;

// Usage example:
// const manager = new OverlayDataManager();
// const unsubscribe = manager.subscribe((data, error) => {
//   if (error) {
//     console.error('Error:', error);
//     return;
//   }
//   
//   if (data) {
//     // All required fields are available
${allFields.map(field => `//     console.log(data.${field}); // ${generateFieldType(field)}${optionalFields.includes(field) ? ' | null' : ''}`).join('\n')}
//   } else {
//     // Waiting for required fields
//     console.log('Waiting for required fields...');
//   }
// });
//
// // Don't forget to cleanup
// // unsubscribe();
// // manager.disconnect();`;

    return classCode;
  };

  const generateNonTypedReactHook = () => {
    const requiredFields = manifestData.requiredFields;
    const optionalFields = manifestData.optionalFields;
    const allFields = [...requiredFields, ...optionalFields];
    const fieldsString = allFields.map(field => `"${field}"`).join(', ');

    const hookCode = `import { useEffect, useRef, useState } from "react";

const useOverlayData = () => {
    const url = "ws://localhost:49791";
    const params = [${fieldsString}];
    const requiredFields = [${requiredFields.map(f => `"${f}"`).join(', ')}];

    const [data, setData] = useState({});
    const [error, setError] = useState(null);

    const socketRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    useEffect(() => {
        let isUnmounted = false;

        const connect = () => {
            const isPreview = /\\bpreview(\\b|=true)/.test(window.location.search);
            const queryParams = \`?preview=\${isPreview ? "true" : "false"}&q=\${params.join(",")}\`;
            const ws = new WebSocket(\`\${url}\${queryParams}\`);
            socketRef.current = ws;

            ws.onopen = () => {
                if (!isUnmounted) setError(null);
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.success && Array.isArray(message.data)) {
                        const updatedData = { ...data };
                        
                        message.data.forEach(([key, value]) => {
                            if (params.includes(key)) {
                                updatedData[key] = value;
                            }
                        });
                        
                        setData(updatedData);
                    } else if (message.errorMessage) {
                        setError(message.errorMessage);
                    }
                } catch {
                    setError("Failed to parse WebSocket message");
                }
            };

            ws.onerror = () => {
                if (!isUnmounted) setError("WebSocket error occurred");
            };

            ws.onclose = () => {
                if (!isUnmounted) {
                    reconnectTimeoutRef.current = setTimeout(connect, 5000);
                }
            };
        };

        connect();

        return () => {
            isUnmounted = true;
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            socketRef.current?.close();
        };
    }, []);

    // Check if all required fields are available
    const hasAllRequiredFields = requiredFields.every(field => 
        data[field] !== undefined && data[field] !== null
    );
    
    if (!hasAllRequiredFields) {
        return { data: null, error };
    }

    // Build nested data object
    const buildNestedData = (flatData) => {
        const result = {};
        
        Object.keys(flatData).forEach(field => {
            const parts = field.split('.');
            let current = result;
            
            for (let i = 0; i < parts.length - 1; i++) {
                if (!current[parts[i]]) {
                    current[parts[i]] = {};
                }
                current = current[parts[i]];
            }
            
            current[parts[parts.length - 1]] = flatData[field];
        });
        
        return result;
    };

    const nestedData = buildNestedData(data);

    return { data: nestedData, error };
};

export default useOverlayData;

// Usage example:
// const { data, error } = useOverlayData();
// 
// data will be null until all required fields are received
// Once available, data will have nested structure:
${allFields.map(field => `// data.${field} // Available field`).join('\n')}`;

    return hookCode;
  };

  const generatePlainJavaScript = () => {
    const requiredFields = manifestData.requiredFields;
    const optionalFields = manifestData.optionalFields;
    const allFields = [...requiredFields, ...optionalFields];
    const fieldsString = allFields.map(field => `"${field}"`).join(', ');

    const jsCode = `class OverlayDataManager {
    constructor() {
        this.url = "ws://localhost:49791";
        this.params = [${fieldsString}];
        this.requiredFields = [${requiredFields.map(f => `"${f}"`).join(', ')}];
        this.data = {};
        this.socket = null;
        this.reconnectTimeout = null;
        this.listeners = [];
        
        this.connect();
    }

    connect() {
        const isPreview = typeof window !== 'undefined' && /\\bpreview(\\b|=true)/.test(window.location.search);
        const queryParams = \`?preview=\${isPreview ? "true" : "false"}&q=\${this.params.join(",")}\`;
        this.socket = new WebSocket(\`\${this.url}\${queryParams}\`);

        this.socket.onopen = () => {
            this.notifyListeners(this.getNestedData(), null);
        };

        this.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.success && Array.isArray(message.data)) {
                    message.data.forEach(([key, value]) => {
                        if (this.params.includes(key)) {
                            this.data[key] = value;
                        }
                    });
                    this.notifyListeners(this.getNestedData(), null);
                } else if (message.errorMessage) {
                    this.notifyListeners(null, message.errorMessage);
                }
            } catch {
                this.notifyListeners(null, "Failed to parse WebSocket message");
            }
        };

        this.socket.onerror = () => {
            this.notifyListeners(null, "WebSocket error occurred");
        };

        this.socket.onclose = () => {
            this.reconnectTimeout = setTimeout(() => this.connect(), 5000);
        };
    }

    getNestedData() {
        const hasAllRequiredFields = this.requiredFields.every(field => 
            this.data[field] !== undefined && this.data[field] !== null
        );
        
        if (!hasAllRequiredFields) {
            return null;
        }

        // Build nested data object
        const result = {};
        
        Object.keys(this.data).forEach(field => {
            const parts = field.split('.');
            let current = result;
            
            for (let i = 0; i < parts.length - 1; i++) {
                if (!current[parts[i]]) {
                    current[parts[i]] = {};
                }
                current = current[parts[i]];
            }
            
            current[parts[parts.length - 1]] = this.data[field];
        });
        
        return result;
    }

    subscribe(callback) {
        this.listeners.push(callback);
        // Immediately call with current data
        callback(this.getNestedData(), null);
        
        // Return unsubscribe function
        return () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    notifyListeners(data, error) {
        this.listeners.forEach(callback => callback(data, error));
    }

    disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }
        if (this.socket) {
            this.socket.close();
        }
        this.listeners = [];
    }
}

// Usage example:
// const manager = new OverlayDataManager();
// const unsubscribe = manager.subscribe((data, error) => {
//   if (error) {
//     console.error('Error:', error);
//     return;
//   }
//   
//   if (data) {
//     // All required fields are available
${allFields.map(field => `//     console.log(data.${field}); // Available field`).join('\n')}
//   } else {
//     // Waiting for required fields
//     console.log('Waiting for required fields...');
//   }
// });
//
// // Don't forget to cleanup
// // unsubscribe();
// // manager.disconnect();

export default OverlayDataManager;`;

    return jsCode;
  };

  // Add state for different code types
  const [plainTypeScript, setPlainTypeScript] = useState<string>('');
  const [nonTypedReactHook, setNonTypedReactHook] = useState<string>('');
  const [plainJavaScript, setPlainJavaScript] = useState<string>('');
  const [activeCodeType, setActiveCodeType] = useState<
    'typed-react' | 'plain-ts' | 'non-typed-react' | 'plain-js'
  >('typed-react');

  // Declare the getSupportedGames function
  const getSupportedGames = (gameSchemas: [GameName, MappedGameData][]) => {
    const supportedGames: string[] = [];
    gameSchemas.forEach(([gameName, schema]) => {
      const gameFields = getAllFieldsFromSchema(schema);
      const hasAllRequired = manifestData.requiredFields.every(field => gameFields.includes(field));
      if (hasAllRequired) {
        supportedGames.push(gameName);
      }
    });
    return supportedGames;
  };

  const getAllFieldsFromSchema = (schema: any, prefix = ''): string[] => {
    const fields: string[] = [];
    Object.entries(schema).forEach(([key, value]) => {
      const fieldPath = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        fields.push(...getAllFieldsFromSchema(value, fieldPath));
      } else {
        fields.push(fieldPath);
      }
    });
    return fields;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generated React Hook</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Button
              onClick={() => {
                generateTypedHookCode();
                setActiveCodeType('typed-react');
              }}
              variant={activeCodeType === 'typed-react' ? 'default' : 'outline'}
            >
              Generate Typed React Hook
            </Button>
            <Button
              onClick={() => {
                setPlainTypeScript(generatePlainTypeScript());
                setActiveCodeType('plain-ts');
              }}
              variant={activeCodeType === 'plain-ts' ? 'default' : 'outline'}
            >
              Generate Plain TypeScript
            </Button>
            <Button
              onClick={() => {
                setNonTypedReactHook(generateNonTypedReactHook());
                setActiveCodeType('non-typed-react');
              }}
              variant={activeCodeType === 'non-typed-react' ? 'default' : 'outline'}
            >
              Generate Non-Typed React Hook
            </Button>
            <Button
              onClick={() => {
                setPlainJavaScript(generatePlainJavaScript());
                setActiveCodeType('plain-js');
              }}
              variant={activeCodeType === 'plain-js' ? 'default' : 'outline'}
            >
              Generate Plain JavaScript
            </Button>
          </div>

          {(generatedHook || plainTypeScript || nonTypedReactHook || plainJavaScript) && (
            <div className="relative">
              <Textarea
                value={
                  activeCodeType === 'typed-react'
                    ? generatedHook
                    : activeCodeType === 'plain-ts'
                      ? plainTypeScript
                      : activeCodeType === 'non-typed-react'
                        ? nonTypedReactHook
                        : plainJavaScript
                }
                readOnly
                className="min-h-[500px] font-mono text-sm"
              />
              <Button
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => {
                  const code =
                    activeCodeType === 'typed-react'
                      ? generatedHook
                      : activeCodeType === 'plain-ts'
                        ? plainTypeScript
                        : activeCodeType === 'non-typed-react'
                          ? nonTypedReactHook
                          : plainJavaScript;
                  navigator.clipboard.writeText(code);
                }}
              >
                Copy
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Required Fields ({manifestData.requiredFields.length}):</Label>
            <div className="mt-1 flex flex-wrap gap-1">
              {manifestData.requiredFields.map(field => (
                <Badge key={field} variant="destructive">
                  {field}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <Label>Optional Fields ({manifestData.optionalFields.length}):</Label>
            <div className="mt-1 flex flex-wrap gap-1">
              {manifestData.optionalFields.map(field => (
                <Badge key={field} variant="secondary">
                  {field}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <Label>Supported Games:</Label>
            <div className="mt-1 flex flex-wrap gap-1">
              {getSupportedGames(gameSchemas).map(game => (
                <Badge key={game} variant="outline">
                  {game}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <Label>Settings Configured:</Label>
            <Badge variant="outline">{manifestData.settings?.length || 0}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
