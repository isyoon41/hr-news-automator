import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import NewsletterGenerator from './components/NewsletterGenerator';
import Settings from './components/Settings';
import SpreadsheetView from './components/SpreadsheetView';
import { ViewState, Newsletter, AppConfig } from './types';
import { Bell } from 'lucide-react';
import { DEFAULT_SYSTEM_INSTRUCTION } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // Mock State "Database"
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [config, setConfig] = useState<AppConfig>({
    emailRecipients: 'hr-team@company.com',
    webhookUrl: 'https://wh.jandi.com/connect-api/webhook/28517436/416195a7cfd3939a2fc4ca3820b87041',
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBkJ_mocked_id',
    scheduleTime: '07:00',
    systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
    templateStyle: {
      headerColor: '#051c2c',
      headerTextColor: '#ffffff',
      footerColor: '#ffffff',
      footerTextColor: '#94a3b8',
      fontFamily: 'serif',
      logoUrl: '',
      logoPosition: 'left'
    },
    emailLayout: {
      headerTitle: 'HR STRATEGY BRIEFING',
      headerSubtitle: 'CONFIDENTIAL • INTERNAL USE ONLY',
      footerContent: 'This automated briefing is generated for executive leadership.\nData Source: Labor Today, Global HR Institutes.'
    }
  });

  const handleSaveNewsletter = (newsletter: Newsletter) => {
    setNewsletters(prev => [newsletter, ...prev]);
  };

  // Function to update an existing newsletter (e.g. after editing or sending)
  const handleUpdateNewsletter = (updatedNewsletter: Newsletter) => {
    setNewsletters(prev => prev.map(n => n.id === updatedNewsletter.id ? updatedNewsletter : n));
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard newsletters={newsletters} config={config} onUpdateNewsletter={handleUpdateNewsletter} />;
      case ViewState.GENERATOR:
        return <NewsletterGenerator onSave={handleSaveNewsletter} config={config} />;
      case ViewState.SPREADSHEET:
        return <SpreadsheetView newsletters={newsletters} />;
      case ViewState.SETTINGS:
        return <Settings config={config} setConfig={setConfig} />;
      default:
        return <Dashboard newsletters={newsletters} config={config} onUpdateNewsletter={handleUpdateNewsletter} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
               <h2 className="text-lg font-semibold text-slate-800">
                 {currentView === ViewState.DASHBOARD && '대시보드'}
                 {currentView === ViewState.GENERATOR && '뉴스레터 생성'}
                 {currentView === ViewState.SPREADSHEET && '기사 DB 로그'}
                 {currentView === ViewState.SETTINGS && '설정'}
               </h2>
            </div>
            <div className="flex items-center space-x-4">
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-slate-800">관리자 (Admin)</p>
                        <p className="text-xs text-slate-500">HR 전략팀</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                        AU
                    </div>
                </div>
            </div>
        </header>

        {/* Main Content */}
        <main className="p-8 max-w-7xl mx-auto">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
