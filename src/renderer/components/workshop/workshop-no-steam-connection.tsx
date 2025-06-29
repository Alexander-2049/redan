const WorkshopNoSteamConnection = () => {
  return (
    <div className="mt-60 p-4 text-center font-sans text-gray-500">
      <img
        src="http://localhost:42049/assets/images/steam.svg"
        alt="Steam Logo"
        className="mx-auto mb-4 h-16 w-16 brightness-50 grayscale filter"
      />
      <div className="text-lg font-semibold">Steam is Offline</div>
      <div className="mt-1 text-sm">But you can use downloaded overlays in "Layouts"</div>
    </div>
  );
};

export default WorkshopNoSteamConnection;
