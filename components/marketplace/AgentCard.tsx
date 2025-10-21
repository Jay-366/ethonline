interface Agent {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  image?: string;
}

interface AgentCardProps {
  agent: Agent;
  onSelect: (agent: Agent) => void;
}

export default function AgentCard({ agent, onSelect }: AgentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{agent.name}</h3>
        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {agent.category}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4">{agent.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-500">★</span>
          <span className="text-sm">{agent.rating}</span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">${agent.price}</p>
          <p className="text-sm text-gray-500">per use</p>
        </div>
      </div>
      
      <button
        onClick={() => onSelect(agent)}
        className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
      >
        Select Agent
      </button>
    </div>
  );
}
