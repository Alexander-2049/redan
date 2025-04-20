import { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { LayoutDataAndFilename } from "@/main/services/layoutService/schemas/layoutSchema";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const MyLayoutsRoute = () => {
  const [layouts, setLayouts] = useState<LayoutDataAndFilename[]>([]);
  const [newLayoutFileName, setNewLayoutFileName] = useState("");

  const updateLayoutList = useCallback(() => {
    window.electron
      .getLayouts()
      .then((data) => setLayouts(data))
      .catch((error) => console.error(error));
  }, [setLayouts]);

  useEffect(() => {
    window.addEventListener("focus", updateLayoutList);
    updateLayoutList();
    return () => {
      window.removeEventListener("focus", updateLayoutList);
    };
  }, []);

  return (
    <>
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold">My Layouts</h1>
              <p className="text-gray-500">
                Manage and customize your overlay layouts
              </p>
            </div>
          </div>
          {/* Content */}
          <div>
            <Input
              value={newLayoutFileName}
              onChange={(event) => setNewLayoutFileName(event.target.value)}
            />
            <Button
              onClick={() => {
                window.electron
                  .createEmptyLayout(newLayoutFileName)
                  .then((list) => {
                    setLayouts(list);
                  })
                  .catch((error) => {
                    console.error("Error in createEmtpyLayout:", error);
                  });
              }}
            >
              Create new layout
            </Button>
            {layouts.map((layout) => (
              <Accordion
                type="multiple"
                className="overflow-hidden rounded-md border-2"
                key={layout.filename}
              >
                <AccordionItem value="item-1" className="bg-card px-2">
                  <AccordionTrigger className="hover:cursor-pointer">
                    {layout.data.name || "No layout name"}
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyLayoutsRoute;
