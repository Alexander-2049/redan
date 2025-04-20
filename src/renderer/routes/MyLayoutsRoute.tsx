import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const MyLayoutsRoute = () => {
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
            <Accordion
              type="multiple"
              className="overflow-hidden rounded-md border-2"
            >
              <AccordionItem value="item-1" className="bg-card px-2">
                <AccordionTrigger className="hover:cursor-pointer">
                  Is it accessible?
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyLayoutsRoute;
