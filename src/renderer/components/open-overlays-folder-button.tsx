import { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { LoaderCircle, SquareArrowOutUpRight } from "lucide-react";

const OpenOverlaysFolderButton = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [, setIsSuccess] = useState<boolean>(true);
  const openOverlaysFolder = useCallback(() => {
    setIsLoading(true);
    window.electron
      .openOverlaysFolder()
      .then(() => {
        setIsSuccess(true);
      })
      .catch(() => {
        setIsSuccess(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Button
      disabled={isLoading}
      variant="outline"
      size="sm"
      onClick={openOverlaysFolder}
    >
      {isLoading ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <SquareArrowOutUpRight className="mr-1 h-4 w-4" />
      )}
      Open Overlays folder
    </Button>
  );
};

export default OpenOverlaysFolderButton;
