// components/LanguageSwitcher.tsx
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";

export const LanguageSwitcher = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleTranslateClick = () => {
    const translateButton = document.querySelector('.goog-te-combo') as HTMLElement;
    if (translateButton) {
      translateButton.click();
    }
  };

  useEffect(() => {
    const checkTranslation = setInterval(() => {
      const isTranslated = document.body.classList.contains('translated-ltr');
      setShowDisclaimer(isTranslated);
    }, 1000);

    return () => clearInterval(checkTranslation);
  }, []);

  return (
    <>
      <button 
        onClick={handleTranslateClick}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>Language</span>
      </button>

      {showDisclaimer && (
        <div className="fixed bottom-4 left-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-xs rounded-md shadow-lg z-[9998]">
          <p className="text-sm text-yellow-700">
            Note: Medical terms may not translate accurately. For precise information, please consult the English version.
          </p>
          <button 
            onClick={() => setShowDisclaimer(false)}
            className="mt-2 text-xs text-yellow-600 hover:text-yellow-800"
          >
            Dismiss
          </button>
        </div>
      )}
    </>
  );
};
