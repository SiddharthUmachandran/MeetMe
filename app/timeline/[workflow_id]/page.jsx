'use client';
import React, { useState } from 'react';
import WorkflowSidebar from './WorkflowSidebar';
import Timeline from './Timeline';

const Dashboard = ({params}) => {
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const sidebarSteps = [
    { id: 'email-collector', type: 'Email Collector', iconName: 'Mail', description: 'Gather and filter emails based on keywords, sender, and date range' },
    { id: 'drive-fetcher', type: 'Drive Fetcher', iconName: 'HardDrive', description: 'Pull relevant documents and files from Google Drive or other sources' },
    { id: 'meeting-recorder', type: 'Meeting Recorder', iconName: 'Video', description: 'Record and transcribe the meeting automatically' },
    { id: 'summary-generator', type: 'Summary Generator', iconName: 'Bot', description: 'Generate meeting summary and send to participants' },
    { id: 'action-item-extractor', type: 'Action Item Extractor', iconName: 'FileText', description: 'Extract and assign action items from meeting transcript' },
    { id: 'slack-sender', type: 'Slack Sender', iconName: 'MessageCircle', description: 'Send a message to a Slack channel' },
    { id: 'google-task', type: 'Google Task', iconName: 'Calendar', description: 'Create and assign a task in Google Tasks' },
  ];
  const handleAddStep = (step) => {
    setWorkflowSteps(prev => [...prev, step]);
  };

  const handleUpdateStep = (updatedStep) => {
    setWorkflowSteps(prev => 
      prev.map(step => step.id === updatedStep.id ? updatedStep : step)
    );
  };

  const handleDeleteStep = (id) => {
    setWorkflowSteps(prev => prev.filter(step => step.id !== id));
  };

  const handleDropStep = (step, position) => {
    const stepWithPosition = { ...step, position };
    const existingStepIndex = workflowSteps.findIndex(s => s.id === step.id);
    
    if (existingStepIndex >= 0) {
      handleUpdateStep(stepWithPosition);
    } else {
      handleAddStep(stepWithPosition);
    }
  };


  return (
    <div className="min-h-screen flex bg-background">
      <WorkflowSidebar />
      <Timeline
        workflowSteps={workflowSteps}
        onAddStep={handleAddStep}
        onUpdateStep={handleUpdateStep}
        onDeleteStep={handleDeleteStep}
        onDropStep={handleDropStep}
        workflowID={React.use(params).workflow_id}
      />
    </div>
  );
};

export default Dashboard;
