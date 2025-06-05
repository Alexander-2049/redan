import { Plus } from "lucide-react";
import { Button } from "@/renderer/components/ui/button";
import { useCreateLayout } from "@/renderer/api/layouts/create-layout";

export function NewLayoutButton() {
  const { mutate: createLayout } = useCreateLayout();

  const handleCreateLayout = () => {
    const racingWords = [
      "Racing",
      "Turbo",
      "Drift",
      "Pitstop",
      "Apex",
      "Circuit",
      "Throttle",
      "Podium",
      "Grid",
      "Lap",
      "Banana",
      "Strike",
      "Falcon",
      "Neon",
      "Shadow",
      "Blaze",
      "Nova",
      "Vortex",
      "Echo",
      "Bolt",
    ];
    const getRandomWord = () =>
      racingWords[Math.floor(Math.random() * racingWords.length)];
    const word1 = getRandomWord();
    let word2 = getRandomWord();
    while (word2 === word1) word2 = getRandomWord();
    const layoutName = `${word1} ${word2}`;
    createLayout({ layoutName, layoutDescription: "" });
  };

  return (
    <Button
      onClick={handleCreateLayout}
      className="w-full bg-blue-100 text-blue-600 shadow-sm hover:bg-blue-200"
    >
      <Plus size={16} className="mr-1" />
      New Layout
    </Button>
  );
}
