import { X, HelpCircle } from 'lucide-react';

import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import { getGameIcon } from '../utils/game-icons';

interface FieldsListProps {
  title: string;
  description: string;
  fields: string[];
  onRemove: (field: string) => void;
  getFieldSupportedGames: (field: string) => string[];
  variant: 'required' | 'optional';
}

export const FieldsList = ({
  title,
  description,
  fields,
  onRemove,
  getFieldSupportedGames,
  variant,
}: FieldsListProps) => {
  const borderColor = variant === 'required' ? 'border-red-200' : 'border-blue-200';
  const headerColor = variant === 'required' ? 'text-red-700' : 'text-blue-700';

  return (
    <Card className={borderColor}>
      <CardHeader className="pb-3">
        <CardTitle className={`text-sm ${headerColor} flex items-center gap-2`}>
          {title}
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {fields.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No {variant} fields configured. Use the + buttons in the schema tree to add fields.
          </p>
        ) : (
          <div className="space-y-2">
            {fields.map(field => {
              const supportedGames = getFieldSupportedGames(field);
              return (
                <div
                  key={field}
                  className="bg-muted/50 flex items-center justify-between gap-2 rounded p-2"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <code className="truncate font-mono text-sm">{field}</code>
                    <div className="flex gap-1">
                      {supportedGames.map(game => (
                        <div key={game} className="text-xs" title={`Supported in ${game}`}>
                          {getGameIcon(game)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(field)}
                    className="text-destructive h-6 w-6 flex-shrink-0 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
