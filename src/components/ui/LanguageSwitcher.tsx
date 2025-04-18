
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { useLanguage, languages } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';

const LanguageSwitcher = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const { toast } = useToast();

  const handleLanguageChange = (language: typeof currentLanguage) => {
    setLanguage(language);
    toast({
      title: "Language changed",
      description: `The language has been changed to ${language.name}`,
      duration: 3000,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center">
          <span className="mr-1">{currentLanguage.flag}</span>
          <span className="hidden md:inline mr-1">{currentLanguage.name}</span>
          <Languages className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className="cursor-pointer"
          >
            <span className="mr-2">{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
