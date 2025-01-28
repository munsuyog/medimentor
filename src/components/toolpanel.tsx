import { useEffect, useState } from "react";

interface ColorPaletteParameters {
  theme: string;
  colors: string[];
}

interface FunctionParameter {
  type: string;
  description: string;
}

interface ArrayParameter extends FunctionParameter {
  items: {
    type: string;
    description: string;
  };
}

interface FunctionDefinition {
  type: "function";
  name: string;
  description: string;
  parameters: {
    type: string;
    strict: boolean;
    properties: {
      theme: FunctionParameter;
      colors: ArrayParameter;
    };
    required: string[];
  };
}

interface SessionUpdate {
  type: string;
  session: {
    tools: FunctionDefinition[];
    tool_choice: string;
  };
}

interface FunctionCallOutput {
  type: string;
  name: string;
  arguments: string;
}

interface ResponseOutput {
  type: string;
  output?: Array<FunctionCallOutput>;
}

interface Event {
  type: string;
  response?: ResponseOutput;
}

interface FunctionCallOutputProps {
  functionCallOutput: FunctionCallOutput;
}

const functionDescription = `
Call this function when a user asks for a color palette.
`;

const sessionUpdate: SessionUpdate = {
  type: "session.update",
  session: {
    tools: [
      {
        type: "function",
        name: "display_color_palette",
        description: functionDescription,
        parameters: {
          type: "object",
          strict: true,
          properties: {
            theme: {
              type: "string",
              description: "Description of the theme for the color scheme.",
            },
            colors: {
              type: "array",
              description: "Array of five hex color codes based on the theme.",
              items: {
                type: "string",
                description: "Hex color code",
              },
            },
          },
          required: ["theme", "colors"],
        },
      },
    ],
    tool_choice: "auto",
  },
};

function FunctionCallOutput({ functionCallOutput }: FunctionCallOutputProps) {
  const { theme, colors } = JSON.parse(functionCallOutput.arguments) as ColorPaletteParameters;
  
  const colorBoxes = colors.map((color) => (
    <div
      key={color}
      className="w-full h-16 rounded-md flex items-center justify-center border border-gray-200"
      style={{ backgroundColor: color }}
    >
      <p className="text-sm font-bold text-black bg-slate-100 rounded-md p-2 border border-black">
        {color}
      </p>
    </div>
  ));

  return (
    <div className="flex flex-col gap-2">
      <p>Theme: {theme}</p>
      {colorBoxes}
      <pre className="text-xs bg-gray-100 rounded-md p-2 overflow-x-auto">
        {JSON.stringify(functionCallOutput, null, 2)}
      </pre>
    </div>
  );
}

interface ToolPanelProps {
  isSessionActive: boolean;
  sendClientEvent: (event: { type: string; response?: { instructions: string } }) => void;
  events: Event[];
}

export default function ToolPanel({
  isSessionActive,
  sendClientEvent,
  events,
}: ToolPanelProps) {
  const [functionAdded, setFunctionAdded] = useState<boolean>(false);
  const [functionCallOutput, setFunctionCallOutput] = useState<FunctionCallOutput | null>(null);

  useEffect(() => {
    if (!events || events.length === 0) return;
    
    const firstEvent = events[events.length - 1];
    if (!functionAdded && firstEvent.type === "session.created") {
      sendClientEvent(sessionUpdate);
      setFunctionAdded(true);
    }

    const mostRecentEvent = events[0];
    if (
      mostRecentEvent.type === "response.done" &&
      mostRecentEvent.response?.output
    ) {
      mostRecentEvent.response.output.forEach((output) => {
        if (
          output.type === "function_call" &&
          output.name === "display_color_palette"
        ) {
          setFunctionCallOutput(output);
          setTimeout(() => {
            sendClientEvent({
              type: "response.create",
              response: {
                instructions: `
                ask for feedback about the color palette - don't repeat 
                the colors, just ask if they like the colors.
              `,
              },
            });
          }, 500);
        }
      });
    }
  }, [events, functionAdded, sendClientEvent]);

  useEffect(() => {
    if (!isSessionActive) {
      setFunctionAdded(false);
      setFunctionCallOutput(null);
    }
  }, [isSessionActive]);

  return (
    <section className="h-full w-full flex flex-col gap-4">
      <div className="h-full bg-gray-50 rounded-md p-4">
        <h2 className="text-lg font-bold">Color Palette Tool</h2>
        {isSessionActive ? (
          functionCallOutput ? (
            <FunctionCallOutput functionCallOutput={functionCallOutput} />
          ) : (
            <p>Ask for advice on a color palette...</p>
          )
        ) : (
          <p>Start the session to use this tool...</p>
        )}
      </div>
    </section>
  );
}