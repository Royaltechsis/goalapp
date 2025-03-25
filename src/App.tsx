import { useState, useEffect } from "react";

import { ArrowDownCircle, ArrowUpCircle,  CheckSquare,  Square } from "lucide-react";
import {  EditorState, } from "draft-js";
import "draft-js/dist/Draft.css"; // Import Draft.js styles
import TextEditor from "./components/texteditor";

import { stateToHTML } from 'draft-js-export-html';

// In your addGoal function:


// Your form submission remains the same

interface Goal {
  id: number;
  name: string;
  time: string;
  description: string;  
  completed: boolean;
  active: boolean;
}

export default function App() {
  const [type, setType] = useState('all');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [id, setId] = useState(0);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const handleDescriptionChange = (state: EditorState) => {
    setEditorState(state);
  };

  // const getDescriptionAsHTML = () => {
  //   const contentState = editorState.getCurrentContent();
  //   const blocks = contentState.getBlocksAsArray();
  //   interface BlockType {
  //     getText(): string;
  //     getType(): string;
  //   }

  //   interface HTMLContent {
  //     text: string;
  //     type: string;
  //   }


  //   return blocks.map((block: BlockType): string => {
  //     const text: string = block.getText();
  //     const type: string = block.getType();
      
  //     // Handle different block types
  //     switch (type) {
  //     case 'header-one':
  //       return `<h1>${text}</h1>`;
  //     case 'header-two':
  //       return `<h2>${text}</h2>`;
  //     case 'unordered-list-item':
  //       return `<ul><li>${text}</li></ul>`;
  //     case 'ordered-list-item':
  //       return `<ol><li>${text}</li></ol>`;
  //     default:
  //       return `<p>${text}</p>`;
  //     }
  //   }).join('');
  // };


  // Fetch goals from local storage on component mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals);
      setGoals(parsedGoals);
      setId(parsedGoals.length > 0 ? parsedGoals[parsedGoals.length - 1].id : 0);
    }
  }, []);

  const handleToggle = (goalId: number) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
  };

  const handleActive = (goalId: number) => {
    const updatedGoals = goals.map(goal => ({
      ...goal,
      active: goal.id === goalId ? !goal.active : false
    }));
    setGoals(updatedGoals);
  };

  const addGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
    const timeframe = (form.elements.namedItem('timeframe') as HTMLInputElement).value;
  
    
    const getDescriptionAsHTML = () => {
      return stateToHTML(editorState.getCurrentContent());
    };

    const newGoal: Goal = {
      id: id + 1,
      name: title,
      time: timeframe,
      description: getDescriptionAsHTML(), // Save the description as raw content
      active: false,
      completed: false
    };
  
    

    setId(id + 1);
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    setEditorState(EditorState.createEmpty()); // Clear the editor
    form.reset();
  };

  const deleteGoal = (goalId: number) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
  };

  const GoalItem = ({ id, name, description, active, completed }: Goal) => (
    <li className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <h2 className={`text-lg ${completed ? 'line-through text-gray-500' : ''}`}>{name}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleActive(id)}
            aria-label={active ? "Collapse details" : "Expand details"}
            className="hover:text-blue-600 transition-colors"
          >
            {active ? <ArrowDownCircle /> : <ArrowUpCircle />}
          </button>
          <button
            onClick={() => handleToggle(id)}
            aria-label={completed ? "Mark incomplete" : "Mark complete"}
            className="hover:text-green-600 transition-colors"
          >
            {completed ? <CheckSquare /> : <Square />}
          </button>
          <button
            onClick={() => deleteGoal(id)}
            aria-label="Delete goal"
            className="hover:text-red-600 transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>
      {active && (
        <div
          className="mt-2 text-gray-900"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </li>
  );

  const FilterTabs = () => (
    <div className="flex flex-col sm:flex-row gap-4  sm:static overflow-x mb-6">
      {['all', 'quick', 'short', 'mid', 'long', 'completed', 'uncompleted'].map((filterType) => (
        <button
          key={filterType}
          onClick={() => setType(filterType)}
          className={`px-4 py-2 rounded-md capitalize transition-colors
            ${type === filterType ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
        >
          {filterType}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Let's Set Some Goals</h1>

        <div className="p-6 mb-8 rounded-xl border bg-card text-card-foreground shadow">
          <form onSubmit={addGoal} className="space-y-4">
            <input
              placeholder="What's your goal?"
              id="name"
              name="title"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              required
            />
            <select
              name="timeframe"
              id="timeframe"
              className="w-full p-2 rounded-md border"
              required
            >
              <option value="quick">Quick win</option>
              <option value="long">Long term</option>
              <option value="short">Short term</option>
              <option value="mid">Mid term</option>
              
            </select>


            <div className="bg-white rounded-md border p-2">
              <TextEditor
                editorState={editorState}
                onDescriptionChange={handleDescriptionChange}
              />
            </div>


            <button type="submit" className="w-full  inline-flex items-center sm:w-min justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0  bg-blue-500 text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 text-white sm:items-end">Set Goal</button>
          </form>
        </div>

        <div className="flex sm:flex-col flex-row w-full">
          <FilterTabs />
          <ul className="space-y-4 w-full ">
            {goals
              .filter(goal => {
                if (type === 'all') return true;
                if (type === 'completed') return goal.completed;
                if (type === 'uncompleted') return !goal.completed;
                return goal.time === type;
              })
              .map(goal => (
                <GoalItem key={goal.id} {...goal} />
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


