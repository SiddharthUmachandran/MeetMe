'use client';
import React, { useState, useEffect} from 'react';
import { supabase, getUserID} from '../supabase/client';
import { createNewTimeline, getProjects } from '../actions/timelineActions';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  User, 
  FolderKanban, 
  Settings, 
  Plus, 
  Video, 
  Edit, 
  ChevronDown, 
  Search, 
  Trash2,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  LogOut
} from 'lucide-react';
import Link from 'next/link';

// Sidebar component with enhanced functionality
const Sidebar = ({ projects, loadingProjects, onDeleteProject, onCreateProject, user, onAuthenticateAccount, router}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const filteredProjects = projects.filter(project =>
    project.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      onCreateProject({
        id: Date.now(),
        name: newProjectName,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      });
      setNewProjectName('');
      setShowNewProjectDialog(false);
    }
  };

  return (
    <div className="w-80 bg-gray-950 border-r border-gray-800 p-6 flex flex-col text-white min-h-screen">
      {/* Profile Section */}
      <div className="flex items-center space-x-3 pb-6 border-b border-gray-800">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold shadow-lg">
            {user.initials}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-950 ${
            user.isOnline ? 'bg-green-500' : 'bg-gray-500'
          }`} />
        </div>
        <div className="flex flex-col flex-1">
          <span className="font-semibold text-gray-100">{user.name}</span>
          <span className="text-sm text-gray-400 truncate">{user.email}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Projects Section */}
      <div className="mt-8 flex flex-col space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Timelines</h3>
          <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-7 px-3 py-1 text-xs text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-gray-900 transition-all duration-200">
                <Plus className="h-3 w-3 mr-1" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-gray-100">Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Project name..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewProjectDialog(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateProject}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!newProjectName.trim()}
                  >
                    Create Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Find a project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {loadingProjects ? (
            <div className="space-y-2 animate-pulse">
              {[1,2,3].map((i) => (
                <div key={i} className="h-12 rounded-lg bg-gray-800/50"></div>
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-700"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <FolderKanban className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <div className="flex flex-col flex-1 min-w-0" onClick={() => router.push(`/timeline/${project.id}`)}>
                    <span className="text-sm text-gray-200 truncate font-medium">{project.name}</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs px-2 py-0.5 ${
                          project.status === 'active' 
                            ? 'bg-green-900 text-green-300 border-green-700' 
                            : project.status === 'paused'
                            ? 'bg-yellow-900 text-yellow-300 border-yellow-700'
                            : 'bg-gray-700 text-gray-300 border-gray-600'
                        }`}
                      >
                        {project.status === 'active' && <Clock className="h-3 w-3 mr-1" />}
                        {project.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(project.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProject(project.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FolderKanban className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No projects found</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 pt-4 mt-6">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
};

// Enhanced Right Panel
const RightPanel = () => {
  const recentActivity = [
    {
      id: 1,
      type: 'project_created',
      title: 'New project "Q4 Strategy" created',
      timestamp: '2 hours ago',
      icon: Plus,
      color: 'text-green-400'
    },
    {
      id: 2,
      type: 'account_connected',
      title: 'Gmail account connected successfully',
      timestamp: '4 hours ago',
      icon: CheckCircle,
      color: 'text-blue-400'
    },
    {
      id: 3,
      type: 'project_updated',
      title: 'Timeline updated for "Marketing Campaign"',
      timestamp: '6 hours ago',
      icon: Edit,
      color: 'text-yellow-400'
    },
    {
      id: 4,
      type: 'project_deleted',
      title: 'Project "Old Campaign" was deleted',
      timestamp: '1 day ago',
      icon: Trash2,
      color: 'text-red-400'
    }
  ];

  return (
    <div className="w-72 bg-gray-950 border-l border-gray-800 p-6 flex flex-col text-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-300">Recent Activity</h3>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-white">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4 flex-1">
        {recentActivity.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-900 transition-colors cursor-pointer">
              <div className={`flex-shrink-0 mt-1 ${activity.color}`}>
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 font-medium leading-tight">{activity.title}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="border-t border-gray-800 pt-4 mt-6">
        <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white text-sm">
          View all activity →
        </Button>
      </div>
    </div>
  );
};

// Enhanced Home Page
const HomePage = ({ projects, user, router }) => {
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    connectedAccounts: Object.values(user.accounts).filter(Boolean).length
  };

  const handleNewTimeline = async () => {
    const result = await createNewTimeline();

    if (result.error) {
        alert(result.error); 
    } else {
        const newTimelineId = result.data.id;
        console.log("timeline id: ", newTimelineId);
        router.push(`/timeline/${newTimelineId}`);
    }
};

  return (
    <div className="p-8 flex-grow overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-100 mb-2">Welcome back, {user.name.split(' ')[0]}!</h1>
          <p className="text-gray-400">Manage your projects and timelines</p>
        </div>
        <Button onClick={async () => {await handleNewTimeline();}} className="bg-gradient-to-r from-blue-600 
        to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-white 
        font-semibold flex items-center space-x-2 rounded-lg px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105">
          <Plus className="h-5 w-5" />
          <span>New Timeline</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Projects</p>
                <p className="text-2xl font-bold text-gray-100">{stats.totalProjects}</p>
              </div>
              <FolderKanban className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 hover:border-green-500 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Active Projects</p>
                <p className="text-2xl font-bold text-gray-100">{stats.activeProjects}</p>
              </div>
              <Clock className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-gray-100">{stats.completedProjects}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Connected Accounts</p>
                <p className="text-2xl font-bold text-gray-100">{stats.connectedAccounts}/2</p>
              </div>
              <Settings className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-gray-800 border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-200 flex items-center">
              <Video className="h-6 w-6 mr-2 text-blue-400" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-64 bg-gray-900 rounded-b-lg">
            <div className="flex flex-col items-center justify-center text-gray-500 text-center">
              <Video size={48} className="mb-4 text-blue-400" />
              <p className="text-lg font-medium mb-2">Watch Tutorial</p>
              <p className="text-sm text-gray-400 max-w-xs">Learn how to create and manage your project timelines effectively</p>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700" size="sm">
                <Video className="h-4 w-4 mr-2" />
                Play Video
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-200 flex items-center">
              <FolderKanban className="h-6 w-6 mr-2 text-purple-400" />
              Recent Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-64 overflow-y-auto">
              {projects.slice(0, 5).map((project, index) => (
                <div key={project.id} className={`p-4 hover:bg-gray-700 transition-colors ${index !== projects.slice(0, 5).length - 1 ? 'border-b border-gray-700' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FolderKanban className="h-4 w-4 text-blue-400" />
                      <span className="text-gray-200 font-medium">{project.name}</span>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        project.status === 'active' 
                          ? 'bg-green-900 text-green-300' 
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Modified {new Date(project.lastModified).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  <p>No projects yet. Create your first project to get started!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    initials: 'JD',
    isOnline: true,
    accounts: {
      gmail: false,
      googleMeet: false
    }
  });
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      const projects = await getProjects();
      console.log("projects:", projects);
      setProjects(projects);
      setLoadingProjects(false);
    };
    fetchProjects();
  }, []);

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  const handleCreateProject = (newProject) => {
    setProjects([...projects, newProject]);
  };

  const handleAuthenticateAccount = (accountType) => {
    setTimeout(() => {
      setUser(prev => ({
        ...prev,
        accounts: {
          ...prev.accounts,
          [accountType]: true
        }
      }));
    }, 1000);
  };

  return (
    <div className="flex bg-gray-950 font-sans min-h-screen">
      <Sidebar 
        projects={projects}
        loadingProjects={loadingProjects}
        onDeleteProject={handleDeleteProject}
        onCreateProject={handleCreateProject}
        user={user}
        onAuthenticateAccount={handleAuthenticateAccount}
        router={router}
      />
      <main className="flex-grow flex">
        <HomePage projects={projects} user={user} router={router} />
        <RightPanel />
      </main>
    </div>
  );
}

