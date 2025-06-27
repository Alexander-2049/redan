import { Input } from "@/renderer/components/ui/input";
import { Label } from "@/renderer/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/renderer/components/ui/card";

interface NestedBoxesProps {
  minWidth: number;
  minHeight: number;
  defaultWidth: number;
  defaultHeight: number;
  maxWidth: number;
  maxHeight: number;
  onMinWidthChange: (value: number) => void;
  onMinHeightChange: (value: number) => void;
  onDefaultWidthChange: (value: number) => void;
  onDefaultHeightChange: (value: number) => void;
  onMaxWidthChange: (value: number) => void;
  onMaxHeightChange: (value: number) => void;
}

export function ConfiguratorNestedBoxes({
  minWidth,
  minHeight,
  defaultWidth,
  defaultHeight,
  maxWidth,
  maxHeight,
  onMinWidthChange,
  onMinHeightChange,
  onDefaultWidthChange,
  onDefaultHeightChange,
  onMaxWidthChange,
  onMaxHeightChange,
}: NestedBoxesProps) {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
      {/* Input Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Box Dimensions Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label
                htmlFor="minWidth"
                className="text-sm font-medium text-blue-600"
              >
                Min Width (Inner)
              </Label>
              <Input
                id="minWidth"
                type="number"
                value={minWidth}
                onChange={(e) => onMinWidthChange(Number(e.target.value))}
                className="border-blue-200"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="minHeight"
                className="text-sm font-medium text-blue-600"
              >
                Min Height (Inner)
              </Label>
              <Input
                id="minHeight"
                type="number"
                value={minHeight}
                onChange={(e) => onMinHeightChange(Number(e.target.value))}
                className="border-blue-200"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="defaultWidth"
                className="text-sm font-medium text-green-600"
              >
                Default Width (Middle)
              </Label>
              <Input
                id="defaultWidth"
                type="number"
                value={defaultWidth}
                onChange={(e) => onDefaultWidthChange(Number(e.target.value))}
                className="border-green-200"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="defaultHeight"
                className="text-sm font-medium text-green-600"
              >
                Default Height (Middle)
              </Label>
              <Input
                id="defaultHeight"
                type="number"
                value={defaultHeight}
                onChange={(e) => onDefaultHeightChange(Number(e.target.value))}
                className="border-green-200"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="maxWidth"
                className="text-sm font-medium text-red-600"
              >
                Max Width (Outer)
              </Label>
              <Input
                id="maxWidth"
                type="number"
                value={maxWidth}
                onChange={(e) => onMaxWidthChange(Number(e.target.value))}
                className="border-red-200"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="maxHeight"
                className="text-sm font-medium text-red-600"
              >
                Max Height (Outer)
              </Label>
              <Input
                id="maxHeight"
                type="number"
                value={maxHeight}
                onChange={(e) => onMaxHeightChange(Number(e.target.value))}
                className="border-red-200"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nested Boxes Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Nested Boxes Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-gray-50">
            {/* Outer Box (Max dimensions) */}
            <div
              className="relative flex items-center justify-center border-4 border-red-500 bg-red-50"
              style={{
                width: `${maxWidth}px`,
                height: `${maxHeight}px`,
                minWidth: "200px",
                minHeight: "200px",
              }}
            >
              <div className="absolute top-2 left-2 rounded bg-white px-2 py-1 text-xs font-semibold text-red-700">
                Outer: {maxWidth} × {maxHeight}
              </div>

              {/* Middle Box (Default dimensions) */}
              <div
                className="relative flex items-center justify-center border-4 border-green-500 bg-green-50"
                style={{
                  width: `${Math.min(defaultWidth, maxWidth - 20)}px`,
                  height: `${Math.min(defaultHeight, maxHeight - 20)}px`,
                  minWidth: "120px",
                  minHeight: "120px",
                }}
              >
                <div className="absolute top-2 left-2 rounded bg-white px-2 py-1 text-xs font-semibold text-green-700">
                  Middle: {defaultWidth} × {defaultHeight}
                </div>

                {/* Inner Box (Min dimensions) */}
                <div
                  className="relative flex items-center justify-center border-4 border-blue-500 bg-blue-50"
                  style={{
                    width: `${Math.min(minWidth, defaultWidth - 20, maxWidth - 40)}px`,
                    height: `${Math.min(minHeight, defaultHeight - 20, maxHeight - 40)}px`,
                    minWidth: "60px",
                    minHeight: "60px",
                  }}
                >
                  <div className="absolute top-2 left-2 rounded bg-white px-2 py-1 text-xs font-semibold text-blue-700">
                    Inner: {minWidth} × {minHeight}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-blue-500 bg-blue-50"></div>
              <span className="text-sm">Inner Box (Min dimensions)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-green-500 bg-green-50"></div>
              <span className="text-sm">Middle Box (Default dimensions)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-red-500 bg-red-50"></div>
              <span className="text-sm">Outer Box (Max dimensions)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
