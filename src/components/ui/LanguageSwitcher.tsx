import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { navigationMenuTriggerStyle } from "./navigation-menu"

export const LanguageSwitcher = () => {
  const [currentLanguage, setCurrentLanguage] = React.useState('en')
  const [isOpen, setIsOpen] = React.useState(false)

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ur', name: 'اردو' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'mr', name: 'मराठी' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'മലയാളം' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  ]

  React.useEffect(() => {
    // Load Google Translate script
    const script = document.createElement('script')
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    document.head.appendChild(script)

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: languages.map(l => l.code).join(','),
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      )
    }

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const changeLanguage = (langCode: string) => {
    setCurrentLanguage(langCode)
    setIsOpen(false)
    
    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo')
    if (select) {
      select.value = langCode
      select.dispatchEvent(new Event('change'))
    }
  }

  return (
    <div className="relative">
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" className="hidden"></div>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          navigationMenuTriggerStyle(),
          "flex items-center gap-1"
        )}
      >
        <span className="text-sm">
          {languages.find(l => l.code === currentLanguage)?.name || 'English'}
        </span>
        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-popover text-popover-foreground z-50">
          <div className="py-1 max-h-60 overflow-auto">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={cn(
                  "block w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
                  currentLanguage === language.code && "bg-accent text-accent-foreground"
                )}
              >
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

