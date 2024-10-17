import { useState, useCallback, useEffect } from "react";
import { Copy, RefreshCw, Check, Shield } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Slider,
} from "@/components";

function App() {
  const [length, setLength] = useState(16);
  const [uppercaseAllowed, setUppercaseAllowed] = useState(true);
  const [lowercaseAllowed, setLowercaseAllowed] = useState(true);
  const [numberAllowed, setNumberAllowed] = useState(true);
  const [specialAllowed, setSpecialAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [copyText, setCopyText] = useState("Copy");
  const [strength, setStrength] = useState(0);

  const generatePassword = useCallback(() => {
    let pass = "";
    let allowedChars = buildAllowedChars();

    setPassword("");

    // Generate password using cryptographically secure random values
    let i = 0;
    const allowedCharsLength = allowedChars.length;
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
    const typingAnimation = setInterval(() => {
      // Typing animation
      if (i < length) {
        pass += allowedChars.charAt(randomValues[i] % allowedCharsLength);
        i++;
        setPassword(pass);
        setStrength(calculatePasswordStrength(pass)); // Calculate strength
      } else {
        clearInterval(typingAnimation);
        setStrength(calculatePasswordStrength(pass)); // Final strength update
      }
    }, 20);
  }, [
    length,
    numberAllowed,
    uppercaseAllowed,
    lowercaseAllowed,
    specialAllowed,
    setPassword,
  ]);

  // Function to build the allowed characters string
  const buildAllowedChars = () => {
    let allowedChars = "";
    if (numberAllowed) {
      allowedChars += "0123456789";
    }
    if (uppercaseAllowed) {
      allowedChars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    if (lowercaseAllowed) {
      allowedChars += "abcdefghijklmnopqrstuvwxyz";
    }
    if (specialAllowed) {
      allowedChars += ".!@#$%^&*()_+";
    }
    return allowedChars;
  };

  // Effect to generate a password when options change
  useEffect(() => {
    generatePassword();
  }, [
    length,
    numberAllowed,
    uppercaseAllowed,
    lowercaseAllowed,
    specialAllowed,
    generatePassword,
  ]);

  // Function to copy the generated password to clipboard
  const copyPassword = () => {
    navigator.clipboard.writeText(password);

    // Set copy button text to "Copied!" temporarily
    setCopyText("Copied!");
    setTimeout(() => {
      setCopyText("Copy");
    }, 2000);
  };

  // Function to handle checkbox state changes
  const handleCheckboxChange = (setStateFunction) => {
    return (checked) => {
      // Ensure at least one option is selected
      if (!checked && countChecked() === 1) {
        return;
      }
      setStateFunction(checked);
    };
  };

  // Function to count the number of selected options
  const countChecked = () => {
    return [
      uppercaseAllowed,
      lowercaseAllowed,
      numberAllowed,
      specialAllowed,
    ].filter(Boolean).length;
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (password.length >= 16) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return strength;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <Card className="w-full max-w-md bg-gray-900 text-white shadow-xl m-3 font-poppins">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-blue-400">
            Random Password Generator
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Craft unbreakable passwords to fortify your digital realm.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative flex items-center justify-center">
            <Input
              value={password}
              readOnly
              className="pr-20 text-lg font-mono bg-gray-800 border-gray-700 text-gray-100"
            />
            <Button
              onClick={copyPassword}
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8"
            >
              {copyText === "Copied!" ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="length"
                className="text-sm font-medium text-gray-300"
              >
                Password Length: {length}
              </Label>
              <Button
                onClick={generatePassword}
                variant="outline"
                size="sm"
                className="bg-gray-700 hover:bg-gray-600"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>
            <Slider
              id="length"
              min={4}
              max={32}
              step={1}
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uppercase"
                checked={uppercaseAllowed}
                onCheckedChange={handleCheckboxChange(setUppercaseAllowed)}
              />
              <Label htmlFor="uppercase" className="text-sm">
                Uppercase (A-Z)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowercase"
                checked={lowercaseAllowed}
                onCheckedChange={handleCheckboxChange(setLowercaseAllowed)}
              />
              <Label htmlFor="lowercase" className="text-sm">
                Lowercase (a-z)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="numbers"
                checked={numberAllowed}
                onCheckedChange={handleCheckboxChange(setNumberAllowed)}
              />
              <Label htmlFor="numbers" className="text-sm">
                Numbers (0-9)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="symbols"
                checked={specialAllowed}
                onCheckedChange={handleCheckboxChange(setSpecialAllowed)}
              />
              <Label htmlFor="symbols" className="text-sm">
                Symbols (!@#$%^&*)
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">
              Password Strength
            </Label>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ease-out ${
                  strength <= 2
                    ? "bg-red-500"
                    : strength <= 4
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${(strength / 6) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Weak</span>
              <span>Strong</span>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
            <Shield className="h-4 w-4" />
            <span>Your password is securely generated in your browser</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
