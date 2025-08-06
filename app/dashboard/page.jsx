'use client';
import React from 'react';
import { Mail, HardDrive, MessageSquare, Send, MoreHorizontal } from 'lucide-react'; // Icons from lucide-react
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'; // Shadcn Card components
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu'; // Shadcn DropdownMenu
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip'; // Shadcn Tooltip

// Reusable Header component for consistent styling
const CardHeaderSection = ({ icon, title, type }) => (
  <div className="flex items-center justify-between pb-3 border-b border-gray-700 mb-4">
    <div className="flex items-center space-x-3">
      <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-white ${
        type === 'gmail' ? 'bg-red-600' :
        type === 'drive' ? 'bg-blue-600' :
        type === 'briefing' ? 'bg-purple-600' :
        type === 'followup' ? 'bg-teal-600' : 'bg-gray-600'
      }`}>
        {icon}
      </div>
      <h2 className="text-lg font-medium text-gray-200">{title}</h2>
    </div>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <MoreHorizontal size={20} className="text-gray-400 hover:text-gray-200 cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent className="bg-gray-700 text-white text-sm px-3 py-1 rounded-md shadow-lg">
          <p>View options</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);

// Card for Relevant Email Gathering (formerly Gmail Action)
export function RelevantEmailGatheringCard({ onPromptChange }) {
  const [selectedEmail, setSelectedEmail] = React.useState("john.doe@example.com"); // Example state for dropdown

  return (
    <Card className="w-full max-w-lg bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-4">
      <CardHeader className="p-0">
        <CardHeaderSection icon={<Mail size={20} />} title="Relevant Email Gathering" type="gmail" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full flex justify-between items-center bg-gray-700 border border-gray-600 text-white rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors duration-200">
              <span>{selectedEmail || "Select an email"}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-gray-700 border border-gray-600 rounded-lg shadow-lg text-white">
              <DropdownMenuItem className="p-2 cursor-pointer hover:bg-gray-600" onClick={() => setSelectedEmail("john.doe@example.com")}>
                john.doe@example.com
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2 cursor-pointer hover:bg-gray-600" onClick={() => setSelectedEmail("jane.smith@example.com")}>
                jane.smith@example.com
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2 cursor-pointer hover:bg-gray-600" onClick={() => setSelectedEmail("team@example.com")}>
                team@example.com
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <textarea
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
          rows="3"
          placeholder="Enter your email prompt here..."
          onChange={(e) => onPromptChange('gmail', e.target.value)}
        ></textarea>
      </CardContent>
    </Card>
  );
}

// Card for Google Drive
export function GoogleDriveCard({ onPromptChange }) {
  return (
    <Card className="w-full max-w-lg bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-4">
      <CardHeader className="p-0">
        <CardHeaderSection icon={<HardDrive size={20} />} title="Google Drive Action" type="drive" />
      </CardHeader>
      <CardContent className="p-0">
        <textarea
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          rows="3"
          placeholder="Specify Google Drive action or query..."
          onChange={(e) => onPromptChange('drive', e.target.value)}
        ></textarea>
      </CardContent>
    </Card>
  );
}

// Card for Briefing Box
export function BriefingBoxCard({ onPromptChange }) {
  return (
    <Card className="w-full max-w-lg bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-4">
      <CardHeader className="p-0">
        <CardHeaderSection icon={<MessageSquare size={20} />} title="Briefing Summary" type="briefing" />
      </CardHeader>
      <CardContent className="p-0">
        <textarea
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
          rows="3"
          placeholder="Enter details for the briefing..."
          onChange={(e) => onPromptChange('briefing', e.target.value)}
        ></textarea>
      </CardContent>
    </Card>
  );
}

// Card for Follow-up Email
export function FollowUpEmailCard({ onPromptChange }) {
  const [selectedRecipient, setSelectedRecipient] = React.useState("recipient@example.com"); // Example state for dropdown

  return (
    <Card className="w-full max-w-lg bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-4">
      <CardHeader className="p-0">
        <CardHeaderSection icon={<Send size={20} />} title="Follow-up Email" type="followup" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full flex justify-between items-center bg-gray-700 border border-gray-600 text-white rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors duration-200">
              <span>{selectedRecipient || "Select recipient"}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-gray-700 border border-gray-600 rounded-lg shadow-lg text-white">
              <DropdownMenuItem className="p-2 cursor-pointer hover:bg-gray-600" onClick={() => setSelectedRecipient("recipient@example.com")}>
                recipient@example.com
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2 cursor-pointer hover:bg-gray-600" onClick={() => setSelectedRecipient("colleague@example.com")}>
                colleague@example.com
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <textarea
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
          rows="3"
          placeholder="Draft your follow-up email prompt..."
          onChange={(e) => onPromptChange('followup', e.target.value)}
        ></textarea>
      </CardContent>
    </Card>
  );
}

// Main App component to display the cards
export default function App() {
  const [prompts, setPrompts] = React.useState({
    gmail: '',
    drive: '',
    briefing: '',
    followup: '',
  });

  const handlePromptChange = (type, value) => {
    setPrompts((prevPrompts) => ({
      ...prevPrompts,
      [type]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col items-center p-8 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-100">Workflow Actions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 w-full max-w-4xl">
        <RelevantEmailGatheringCard onPromptChange={handlePromptChange} />
        <GoogleDriveCard onPromptChange={handlePromptChange} />
        <BriefingBoxCard onPromptChange={handlePromptChange} />
        <FollowUpEmailCard onPromptChange={handlePromptChange} />
      </div>
      {/* You can display the collected prompts here for debugging or further use */}
      {/* <div className="mt-8 p-4 bg-gray-800 rounded-lg text-gray-300 w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-2">Current Prompts:</h2>
        <pre>{JSON.stringify(prompts, null, 2)}</pre>
      </div> */}
    </div>
  );
}
