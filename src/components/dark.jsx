import { useTheme } from "./context/theme";
import { Button } from "./buton";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2">
      <Button
        variant={theme === "light" ? "default" : "outline"}
        onClick={() => setTheme("light")}
      >
        ☀️ Light
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "outline"}
        onClick={() => setTheme("dark")}
      >
        🌙 Dark
      </Button>
      <Button
        variant={theme === "system" ? "default" : "outline"}
        onClick={() => setTheme("system")}
      >
        🖥️ System
      </Button>
    </div>
  );
}
