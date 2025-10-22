interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface ToolPanelProps {
  tools: Tool[];
  onToolSelect: (tool: Tool) => void;
}

export default function ToolPanel({ tools, onToolSelect }: ToolPanelProps) {
  return (
    <div className="w-64 bg-gray-100 p-4">
      <h3 className="text-lg font-semibold mb-4">Available Tools</h3>
      <div className="space-y-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolSelect(tool)}
            className="w-full text-left p-3 bg-white rounded-lg hover:bg-gray-50 border"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{tool.icon}</span>
              <div>
                <h4 className="font-medium">{tool.name}</h4>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}








