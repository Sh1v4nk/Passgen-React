import { useState, useCallback, useEffect } from "react";

function App() {
  const [length, setLength] = useState("16");
  const [uppercaseAllowed, setUppercaseAllowed] = useState(true);
  const [lowercaseAllowed, setLowercaseAllowed] = useState(true);
  const [numberAllowed, setNumberAllowed] = useState(true);
  const [specialAllowed, setSpecialAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [copyText, setCopyText] = useState("Copy");

  const generatePassword = useCallback(() => {
    let pass = "";
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
      } else {
        clearInterval(typingAnimation);
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
  const copyPassword = (e) => {
    navigator.clipboard.writeText(password);

    // Set copy button text to "Copied!" temporarily
    setCopyText("Copied!");
    setTimeout(() => {
      setCopyText("Copy");
    }, 2000);
  };

  // Function to handle checkbox state changes
  const handleCheckboxChange = (setStateFunction) => {
    return (e) => {
      const checked = e.target.checked;

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

  return (
    <>
      <div className="w-full h-screen flex flex-col justify-center items-center font-poppins">
        <div className="flex flex-col justify-center items-center gap-4 m-8">
          <h1 className="flex max-lg:flex-col text-center text-light-white font-bold text-3xl sm:text-5xl">
            Random Password Generator.
          </h1>
          <h2 className="text-light-white text-center opacity-95 text-xs sm:text-base font-light self-center">
            Make sure your passwords are strong and secure to protect your
            online account.
          </h2>
        </div>
        <div className="flex max-lg:flex-col mx-4 gap-4">
          <div className="flex rounded-full md:w-96 select-none border border-blue-600 p-3">
            <input
              type="text"
              disabled
              className="w-full text-light-white select-none bg-transparent ml-2"
              value={password}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              className="w-6 h-6 mr-2 ml-2 select-none"
              onClick={generatePassword}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
          <button
            className="bg-blue-600 w-full lg:hover:bg-blue-500 select-none hover:scale-110 active:scale-90 transition text-light-white rounded-full p-3 lg:w-32"
            onClick={copyPassword}
          >
            {copyText}
          </button>
        </div>
        <div className="flex max-lg:flex-col text-center items-center gap-6 max-w-md my-6">
          <h3 className="text-light-white w-80 text-lg font-light">
            Password length : <span className="font-bold m-2">{length}</span>
          </h3>
          <input
            type="range"
            className="cursor-pointer w-4/5 rounded-lg h-1 accent-blue-600"
            min="1"
            max="50"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
        </div>
        <div className="flex max-lg:flex-col text-center items-center gap-6 max-w-md m-4">
          <h3 className="text-light-white text-lg font-light">
            Characters used :
          </h3>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={uppercaseAllowed}
                onChange={handleCheckboxChange(setUppercaseAllowed)}
                className="accent-blue-600 h-4 w-4 rounded-full"
              />
              <p className="text-light-white text-lg font-bold">ABC</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={lowercaseAllowed}
                onChange={handleCheckboxChange(setLowercaseAllowed)}
                className="accent-blue-600 h-4 w-4"
              />
              <p className="text-light-white text-lg font-bold">abc</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={numberAllowed}
                onChange={handleCheckboxChange(setNumberAllowed)}
                className="accent-blue-600 h-4 w-4"
              />
              <p className="text-light-white text-lg font-bold">123</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={specialAllowed}
                onChange={handleCheckboxChange(setSpecialAllowed)}
                className="accent-blue-600 h-4 w-4"
              />
              <p className="text-light-white text-lg font-bold">#$&</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
