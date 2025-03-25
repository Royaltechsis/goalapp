import { useState, useEffect } from "react";

import { ArrowDownCircle, ArrowUpCircle,  CheckSquare,  Menu,  Square, Trash2 } from "lucide-react";
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
  duaration: any;
  description: string;  
  completed: boolean;
  active: boolean;
}

export default function App() {
  const [type, setType] = useState('all');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [id, setId] = useState(0);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const[active, setActive] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  const handlemenu = () => {
    setActive(!active);
  }

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

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default mini-infobar from appearing
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install button
      setShowInstallButton(true);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("App is running as a PWA");
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      (deferredPrompt as any).prompt();

      // Wait for the user to respond to the prompt
      const choiceResult = await (deferredPrompt as any).userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }

      // Clear the deferred prompt
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

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
    const startValue = (form.elements.namedItem('startdate') as HTMLInputElement).value;
    const endValue = (form.elements.namedItem('enddate') as HTMLInputElement).value;
    if (!startValue || !endValue) {
      alert("Please enter both start and end dates.");
      return;
    }
    const start = new Date(startValue).getTime();
    const end = new Date(endValue).getTime();
    const diff = end - start;
    const totalMinutes = Math.floor(diff / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const time = `${hours > 0 ? `${hours}hr${hours > 1 ? 's' : ''} ` : ''}${minutes}min`;
  
    
    const getDescriptionAsHTML = () => {
      return stateToHTML(editorState.getCurrentContent());
    };

    const newGoal: Goal = {
      id: id + 1,
      name: title,
      time: timeframe,
      duaration : time,
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

  const GoalItem = ({ id, name, description, active, completed, duaration}: Goal) => (
    <li className="sm:p-4 p-2 border rounded-lg shadow-sm border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <h2 className={`sm:text-lg text-sm ${completed ? 'line-through text-gray-500' : ''}`}>{name}</h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleActive(id)}
            aria-label={active ? "Collapse details" : "Expand details"}
            className="hover:text-blue-600 transition-colors"
          >
            {active ? <ArrowDownCircle  className="w-4 h-4 md:w-6 md:h-6"  /> : <ArrowUpCircle  className="w-4 h-4 md:w-6 md:h-6"  />}
          </button>
          <button
            onClick={() => handleToggle(id)}
            aria-label={completed ? "Mark incomplete" : "Mark complete"}
            className="hover:text-green-600 transition-colors"
          >
            {completed ? <CheckSquare   className="w-4 h-4 md:w-6 md:h-6" /> : <Square  className="w-4 h-4 md:w-6 md:h-6"  />}
          </button>
            <button
            onClick={() => deleteGoal(id)}
            aria-label="Delete goal"
            className="hover:text-red-600 transition-colors"
            >
            <Trash2 className="w-4 h-4 md:w-6 md:h-6" />
            </button>
        </div>
      </div>
      {active && (
        
        <><div
          className="mt-2"
          dangerouslySetInnerHTML={{ __html: description }} /><p className="text-xs py-3 text-red-500">you have {duaration} left </p></>
      )}
    </li>
  );

  const FilterTabs = () => (
    <div className="sm:flex  flex-col sm:flex-row gap-4 hidden sm:static overflow-x mb-6">
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
  const Mobile = () => {
    return (
      <div className="relative inline-block sm:hidden text-left">
        <button
          onClick={handlemenu}
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium sticky  text-gray-700 gap-2 hover:bg-gray-50"
        >
          <Menu /> <h1 className="capitalize ">filter goals</h1>
        </button>
        {active && (
          <div className="origin-top-right absolute right-0 mt-2  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 w-full">
            <div className="py-1">
              {['all', 'quick', 'short', 'mid', 'long', 'completed', 'uncompleted'].map(
                (filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setType(filterType)}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      type === filterType
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {filterType}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Let's Set Some Goals</h1>

        {/* Show the install button if the PWA can be installed */}
        {showInstallButton && (
          <div className="flex justify-center mb-4">
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
            >
              Install App
            </button>
          </div>
        )}

        <div className="py-6 px-3 sm:p-6 mb-8 rounded-xl border bg-card text-card-foreground shadow">
          <form onSubmit={addGoal} className="space-y-4">
            <input
              placeholder="What's your goal?"
              id="name"
              name="title"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm sm:text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              required
              
            />
            <select
              name="timeframe"
              id="timeframe"
              className="w-full p-2 rounded-md  text-sm sm:text-base border"
              required
            >
              <option className="text-sm sm:text-base" value="quick">Quick win</option>
              <option className="text-sm sm:text-base" value="long">Long term</option>
              <option className="text-sm sm:text-base" value="short">Short term</option>
              <option className="text-sm sm:text-base" value="mid">Mid term</option>
              
            </select>
            
            <div className="flex flex-col sm:flex-row gap-2 items-center space-between w-full">
              <div className="flex gap-2  w-full items-center text-semibold">
                <label htmlFor="startdate" className="sm:hidden block text-sm sm:text-base"> Start</label>
              <input
              type="datetime-local"
              placeholder="t-date"
              id="startdate"
              name="startdate"
              className="flex h-9 w-full space-between rounded-md border border-input bg-transparent p-1  text-sm sm:text-base text-gray-600 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              
              />
              </div>
             <div className="flex gap-2 w-full items-center text-semibold text-sm sm:text-base">
              <label htmlFor="enddate" className="sm:hidden block"> End</label>
             <input
              type="datetime-local"
              placeholder="End "
              id="enddate"
              name="enddate"
              className="flex h-9  w-full   rounded-md border border-input bg-transparent p-1 text-sm sm:text-base text-gray-600 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              
              />
             </div>
            </div>


            <div className="bg-white rounded-md border p-2">
              <TextEditor
                editorState={editorState}
                onDescriptionChange={handleDescriptionChange}
              />
            </div>


            <button type="submit" className="w-full  inline-flex items-center sm:w-min justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0  bg-blue-500 text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 text-white sm:items-end">Set Goal</button>
          </form>
        </div>

        <div className="flex flex-col w-full">
          <FilterTabs />
          <Mobile/>

          {goals.length === 0 ? 
            <div className="flex flex-col items-center justify-center mt-8 p-4  bg-white">
              <h1 className="text-2xl font-bold text-center mb-2">No goals yet!</h1>
              <p className="mb-4 text-center text-gray-600">
              Start setting your goals to unlock your true potential.
              </p>
              
            </div> :
            <ul className="space-y-2 sm:space-y-4 mt-4 w-full ">
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
            
            }
          
        </div>
      </div>
    </div>
  );
}


