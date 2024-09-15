"use client";

import { useState } from "react";

export default function Home() {
  const [inputJson, setInputJson] = useState("");
  const [outputJson, setOutputJson] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy Formatted");

  const formatJson = () => {
    try {
      const parsedJson = JSON.parse(inputJson);
      setOutputJson(JSON.stringify(parsedJson, null, 2));
    } catch (error) {
      setOutputJson("Invalid JSON");
    }
  };

  const clearInput = () => {
    setInputJson("");
    setOutputJson("");
  };

  const copyOutput = async () => {
    if (outputJson === "" || outputJson === "Invalid JSON") return;

    navigator.clipboard.writeText(outputJson);
    setCopyButtonText("Copied!");
    setTimeout(() => setCopyButtonText("Copy Formatted"), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen p-4 space-y-4 lg:space-y-0 lg:space-x-4">
      <div className="h-[calc(50vh-2rem)] lg:h-auto lg:flex-1 border border-gray-700 rounded">
        <textarea
          className="w-full h-full p-2 rounded bg-transparent text-gray-100 placeholder-gray-400 caret-yellow-500"
          value={inputJson}
          onChange={(e) => setInputJson(e.target.value)}
          placeholder="Enter stringified JSON here"
        />
      </div>
      <div className="flex flex-col justify-center lg:w-40">
        <div className="space-y-2">
          <p className="text-2xl font-bold">JSON Formatter</p>
          <button
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={formatJson}
          >
            Format JSON
          </button>
          <button
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={clearInput}
          >
            Clear Input
          </button>
          <button
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={copyOutput}
          >
            {copyButtonText}
          </button>
        </div>
      </div>
      <div className="h-[calc(50vh-2rem)] lg:h-auto lg:flex-1 border border-gray-700 rounded">
        <pre className="w-full h-full p-2 rounded overflow-auto bg-transparent text-gray-100 whitespace-pre-wrap">
          {outputJson}
        </pre>
      </div>
    </div>
  );
}
